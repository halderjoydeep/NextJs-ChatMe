import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validations";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse({ ...body });

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthenticated", { status: 401 });
    }

    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`,
    )) as string;

    if (!idToAdd) {
      return new Response("This person does not exist", { status: 400 });
    }

    if (idToAdd === session.user.id) {
      return new Response("Can't send friend request to yourself", {
        status: 400,
      });
    }

    const isAlreadySent = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:requests`,
      session.user.id,
    )) as 0 | 1;

    if (isAlreadySent) {
      return new Response("Friend request already sent!", { status: 400 });
    }

    const isAlreadyFriend = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:friends`,
      session.user.id,
    )) as 0 | 1;

    if (isAlreadyFriend) {
      return new Response("Already friend!", { status: 400 });
    }

    await db.sadd(`user:${idToAdd}:requests`, session.user.id);

    return new Response("Ok");
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Invalid Request Payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
