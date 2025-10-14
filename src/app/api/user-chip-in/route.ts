import type { AdapterUser } from "@auth/core/adapters";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { czk_amount, object_id } = await request.json();

        if (!czk_amount || typeof czk_amount !== "number" || czk_amount <= 0) {
            return Response.json({ error: "Invalid czk_amount" }, { status: 400 });
        }

        if (!object_id || typeof object_id !== "string" || object_id.trim().length === 0) {
            return Response.json({ error: "Invalid object_id" }, { status: 400 });
        }

        const object = await db.object.findUnique({ where: { id: object_id }, include: { chips: true } });

        if (!object) {
            return Response.json({ error: "Object not found" }, { status: 404 });
        }

        if (czk_amount > Number(object.total_price)) {
            return Response.json({ error: "Czk amount exceeds object's total price" }, { status: 400 });
        }

        // get current chip total of object
        // const current_total = object.chips
        //     ?.filter((x) => x.verified)
        //     ?.reduce((acc, chip) => acc + Number(chip.czk_amount), 0);

        // if (current_total + czk_amount > Number(object.total_price)) {
        //     return Response.json({ error: "Czk amount exceeds object's total price" }, { status: 400 });
        // }

        if (object.chips.some((chip) => chip.chippedInByUserId === (session.user as unknown as AdapterUser).id)) {
            return Response.json({ error: "You have already chipped in to this object" }, { status: 400 });
        }

        const chip = await db.chip.create({
            data: {
                czk_amount,
                chippedInByUserId: (session.user as unknown as AdapterUser).id,
                objectId: object_id,
                verified: false, // When normal user chips in, it's not verified
            },
            include: {
                chippedInByUser: true,
                object: true,
            },
        });

        return Response.json(chip);
    } catch (error) {
        console.error("Error chipping in:", error);
        return Response.json({ error: "Failed to chip in" }, { status: 500 });
    }
}
