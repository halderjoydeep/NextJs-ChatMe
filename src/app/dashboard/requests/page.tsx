import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { User, getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const page: React.FC = async () => {
  const session = await getServerSession(authOptions);

  console.log("request is called");

  if (!session) notFound();

  const incomingRequestIds = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:requests`,
  )) as string[];

  const incomingRequests = await Promise.all(
    incomingRequestIds.map(async (id) => {
      const sender = (await fetchRedis("get", `user:${id}`)) as string;
      const senderParsed = JSON.parse(sender) as User;

      return {
        id,
        email: senderParsed.email,
      };
    }),
  );

  return (
    <div className="pt-8">
      <h1 className="mb-8 text-5xl font-bold">Friend Requests</h1>

      <FriendRequests
        initialRequests={incomingRequests}
        sessionId={session.user.id}
      />
    </div>
  );
};

export default page;
