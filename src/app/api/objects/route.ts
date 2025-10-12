import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const objects = await db.object.findMany({
            include: { chips: { orderBy: { czk_amount: "desc" } } },
            orderBy: { createdAt: "desc" },
        });

        return Response.json(objects);
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

        const { name, description, imageUrl, total_price } = await request.json();

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return Response.json({ error: "Invalid name" }, { status: 400 });
        }

        if (description && typeof description !== "string") {
            return Response.json({ error: "Invalid description" }, { status: 400 });
        }

        if (!total_price || typeof total_price !== "number" || total_price <= 0) {
            return Response.json({ error: "Invalid total_price" }, { status: 400 });
        }

        const obj = await db.object.create({
            data: {
                id: name
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-"),
                name: name.trim(),
                description: description.trim(),
                imageUrl: imageUrl ? imageUrl.trim() : "",
                total_price,
            },
            include: {
                chips: true,
            },
        });

        return Response.json(obj);
    } catch (error) {
        console.error("Error creating object:", error);
        return Response.json({ error: "Failed to create object" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth();

        if (session?.user?.role != "Admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { object_id } = await request.json();

        if (!object_id || typeof object_id !== "string" || object_id.trim().length === 0) {
            return Response.json({ error: "Invalid id" }, { status: 400 });
        }

        await db.object.delete({
            where: { id: object_id },
        });

        return Response.json({ message: "Object deleted" });
    } catch (error) {
        console.error("Error deleting object:", error);
        return Response.json({ error: "Failed to delete object" }, { status: 500 });
    }
}
