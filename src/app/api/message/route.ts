import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherChannel } from "@/lib/utils";
import { Message, messageValidator } from "@/lib/validations";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) return new Response("Unauthorized", { status: 401 });

    const [userId1, userId2] = chatId.split("--");

    if (session.user.id !== userId1 && session.user.id !== userId2)
      return new Response("Unauthorized", { status: 401 });

    const partnerId = session.user.id === userId1 ? userId2 : userId1;

    const isFriend = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      partnerId,
    )) as 0 | 1;

    if (!isFriend) return new Response("Unauthorized", { status: 401 });

    const timestamp = Date.now();

    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messageData);

    await pusherServer.trigger(
      toPusherChannel(`chat:${chatId}:messages`),
      "messages",
      message,
    );

    await pusherServer.trigger(
      toPusherChannel(`user:${partnerId}:chats`),
      "new-message",
      {
        ...message,
        senderImage: session.user.image,
        senderName: session.user.name,
      },
    );

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response("Ok");
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
