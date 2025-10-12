import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET() {
    try {
        const session = await auth();

        if (session?.user?.role != "Admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const users = await db.user.findMany();
        return Response.json(users);
    } catch (error) {
        console.log(error);
        return Response.json({}, { status: 500 });
    }
}
