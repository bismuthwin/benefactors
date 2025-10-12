import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const chips = await db.chip.findMany({ include: { chippedInByUser: true } });

        return Response.json(chips);
    } catch (error) {
        console.log(error);
        return Response.json({}, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (session?.user?.role != "Admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { czk_amount, object_id, user_id, name, verified } = await request.json();

        if (!czk_amount || typeof czk_amount !== "number" || czk_amount <= 0) {
            return Response.json({ error: "Invalid czk_amount" }, { status: 400 });
        }

        if (!object_id || typeof object_id !== "string" || object_id.trim().length === 0) {
            return Response.json({ error: "Invalid object_id" }, { status: 400 });
        }

        const object = await db.object.findUnique({ where: { id: object_id } });

        if (!object) {
            return Response.json({ error: "Object not found" }, { status: 404 });
        }

        if (czk_amount > Number(object.total_price)) {
            return Response.json({ error: "Czk amount exceeds object's total price" }, { status: 400 });
        }

        // find user
        if (user_id) {
            const user = await db.user.findUnique({ where: { id: user_id } });
            if (!user) {
                // Create the user
                await db.user.create({
                    data: {
                        id: user_id,
                        name: name ?? "Someone",
                        image: "",
                    },
                });
            }
        }

        const chip = await db.chip.create({
            data: {
                czk_amount,
                chippedInByUserId: user_id ?? session.user.discord_id,
                objectId: object_id,
                verified: verified ?? false,
            },
            include: {
                chippedInByUser: true,
                object: true,
            },
        });

        return Response.json(chip);
    } catch (error) {
        console.error("Error creating funny:", error);
        return Response.json({ error: "Failed to create funny" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth();

        if (session?.user?.role != "Admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, czk_amount } = await request.json();

        if (!id || typeof id !== "string" || id.trim().length === 0) {
            return Response.json({ error: "Invalid id" }, { status: 400 });
        }

        if (!czk_amount || typeof czk_amount !== "number" || czk_amount <= 0) {
            return Response.json({ error: "Invalid czk_amount" }, { status: 400 });
        }

        const chip = await db.chip.update({
            where: { id },
            data: { czk_amount },
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

export async function DELETE(request: Request) {
    try {
        const session = await auth();
        if (session?.user?.role != "Admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await request.json();

        if (!id || typeof id !== "string" || id.trim().length === 0) {
            return Response.json({ error: "Invalid id" }, { status: 400 });
        }

        await db.chip.delete({
            where: { id },
        });

        return Response.json({ message: "Chip deleted successfully" });
    } catch (error) {
        console.error("Error deleting chip:", error);
        return Response.json({ error: "Failed to delete chip" }, { status: 500 });
    }
}
