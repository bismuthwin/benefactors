import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const objects = await db.object.findMany({ include: { chips: true }, orderBy: { createdAt: "desc" } });

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

export async function PUT(request: Request) {
    try {
        const session = await auth();

        if (session?.user?.role != "Admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, name, description, imageUrl, total_price } = await request.json();

        if (!id || typeof id !== "string" || id.trim().length === 0) {
            return Response.json({ error: "Invalid id" }, { status: 400 });
        }

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return Response.json({ error: "Invalid name" }, { status: 400 });
        }

        if (description && typeof description !== "string") {
            return Response.json({ error: "Invalid description" }, { status: 400 });
        }

        if (imageUrl && typeof imageUrl !== "string") {
            return Response.json({ error: "Invalid imageUrl" }, { status: 400 });
        }

        if (!total_price || typeof total_price !== "number" || total_price <= 0) {
            return Response.json({ error: "Invalid total_price" }, { status: 400 });
        }

        const obj = await db.object.update({
            where: { id },
            data: {
                name: name.trim(),
                description: description.trim(),
                imageUrl: imageUrl.trim(),
                total_price,
            },
            include: {
                chips: true,
            },
        });

        return Response.json(obj);
    } catch (error) {
        console.error("Error updating object:", error);
        return Response.json({ error: "Failed to update object" }, { status: 500 });
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

        await db.object.delete({
            where: { id },
        });

        return Response.json({ message: "Object deleted" });
    } catch (error) {
        console.error("Error deleting object:", error);
        return Response.json({ error: "Failed to delete object" }, { status: 500 });
    }
}
