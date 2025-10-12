import type { NextRequest } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // get slug (i cba finding the proper way of doing this)
        const id = request.nextUrl.pathname.split("/").pop();

        if (!id || typeof id !== "string" || id.trim().length === 0) {
            return Response.json({ error: "Invalid id" }, { status: 400 });
        }

        const object = await db.object.findUnique({
            where: { id },
            include: {
                chips: {
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
