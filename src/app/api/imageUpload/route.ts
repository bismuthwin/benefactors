import { env } from "~/env";
import { auth } from "~/server/auth";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (session?.user?.role != "Admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const image = formData.get("image") as File | null;

        if (!image) {
            return Response.json({ error: "No image provided" }, { status: 400 });
        }

        if (image.size > 10 * 1024 ** 2) {
            // 10 MB
            return Response.json({ error: "Image too large" }, { status: 400 });
        }

        // Convert image to buffer and create proper multipart form data
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const boundary = `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
        const parts: Buffer[] = [];

        parts.push(Buffer.from(`--${boundary}\r\n`));
        parts.push(Buffer.from(`Content-Disposition: form-data; name="f"; filename="${image.name}"\r\n`));
        parts.push(Buffer.from(`Content-Type: ${image.type || "application/octet-stream"}\r\n\r\n`));
        parts.push(buffer);
        parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));

        const body = Buffer.concat(parts);

        const response = await fetch(
            `${env.COPYPARTY_URL}/?want=url&pw=${env.COPYPARTY_USERNAME}:${env.COPYPARTY_PASSWORD}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${boundary}`,
                },
                body: body,
            },
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to upload image to copyparty:", response.status, response.statusText);
            return Response.json(
                {
                    error: "Failed to upload image",
                    details: `${response.status}: ${errorText}`,
                },
                { status: 500 },
            );
        }

        const imageUrl = await response.text();
        return Response.json({ url: imageUrl.trim() });
    } catch (error) {
        console.error("Error uploading image:", error);
        return Response.json({ error: "Failed to upload image :(" }, { status: 500 });
    }
}
