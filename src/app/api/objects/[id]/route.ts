import { auth } from "~/server/auth";
import { db } from "~/server/db";
import type { ObjectFormModel } from "~/types/ObjectFormModel";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // const session = await auth();

        // if (!session?.user) {
        //     return Response.json({ error: "Unauthorized" }, { status: 401 });
        // }

        // get slug (i cba finding the proper way of doing this)
        const { id } = await params;

        if (!id || typeof id !== "string" || id.trim().length === 0) {
            return Response.json({ error: "Invalid id" }, { status: 400 });
        }

        const object = await db.object.findUnique({
            where: { id },
            include: {
                chips: {
                    orderBy: [{ verified: "desc" }, { czk_amount: "desc" }],
                    include: { chippedInByUser: true },
                },
            },
        });

        if (!object) {
            return Response.json({ error: "Object not found" }, { status: 404 });
        }

        return Response.json(object);
    } catch (error) {
        console.log(error);
        return Response.json({}, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();

        if (session?.user?.role != "Admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, description, imageUrl, total_price, finished, unlisted }: ObjectFormModel = await request.json();
        const { id } = await params;

        const existingObject = await db.object.findUnique({ where: { id } });

        await db.object.update({
            where: { id },
            data: {
                name:
                    name ??
                    existingObject?.name
                        .trim()
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-"),
                description: description ?? existingObject?.description,
                imageUrl: imageUrl ?? existingObject?.imageUrl,
                total_price: total_price ?? existingObject?.total_price,
                finished: finished ?? existingObject?.finished,
                unlisted: unlisted ?? existingObject?.unlisted,
            },
        });

        return Response.json({}, { status: 200 });
    } catch (error) {
        console.error("Error updating object:", error);
        return Response.json({ error: "Failed to update object" }, { status: 500 });
    }
}
