import type { AdapterUser } from "@auth/core/adapters";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();

        if (session?.user?.role != "Admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // get slug (i cba finding the proper way of doing this)
        const { id } = await params;

        if (!id || typeof id !== "string" || id.trim().length === 0) {
            return Response.json({ error: "Invalid id" }, { status: 400 });
        }

        console.log(`the id is ${id}`);

        // Get verification status
        const existingChip = await db.chip.findUnique({
            where: { id },
        });

        if (!existingChip) {
            return Response.json({ error: "Chip not found" }, { status: 404 });
        }

        const chip = await db.chip.update({
            where: { id },
            data: {
                verified: !existingChip.verified,
                verifiedAt: new Date(),
                verifiedByUserId: (session.user as unknown as AdapterUser).id,
            },
            include: {
                chippedInByUser: true,
                object: true,
            },
        });

        return Response.json(chip);
    } catch (error) {
        console.error("Error updating chip:", error);
        return Response.json({ error: "Failed to update chip" }, { status: 500 });
    }
}
