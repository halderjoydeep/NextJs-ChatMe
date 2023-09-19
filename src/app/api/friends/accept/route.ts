import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherChannel } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { ZodError, z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);

    if (!session) return new Response("Unauthorized", { status: 401 });

    const isAlreadyFriend = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd,
    )) as 0 | 1;

    if (isAlreadyFriend) {
      return new Response("Already friends", { status: 400 });
    }

    const hasFriendRequest = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:requests`,
      idToAdd,
    )) as 0 | 1;

    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 });
    }

    const friendRaw = (await fetchRedis("get", `user:${idToAdd}`)) as string;

    const friend = JSON.parse(friendRaw);

    await Promise.all([
      pusherServer.trigger(
        toPusherChannel(`user:${session.user.id}:friends`),
        "new-friend",
        friend,
      ),
      pusherServer.trigger(
        toPusherChannel(`user:${idToAdd}:friends`),
        "new-friend",
        session.user,
      ),
      db.sadd(`user:${session.user.id}:friends`, idToAdd),
      db.sadd(`user:${idToAdd}:friends`, session.user.id),
      db.srem(`user:${session.user.id}:requests`, idToAdd),
    ]);

    return new Response("OK");
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Invalid payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
}
