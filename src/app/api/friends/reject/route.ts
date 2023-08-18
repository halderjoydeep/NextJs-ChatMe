import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { ZodError, z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToReject } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);

    if (!session) return new Response("Unauthorized", { status: 401 });

    await db.srem(`user:${session.user.id}:requests`, idToReject);

    return new Response("OK");
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Invalid payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
}
