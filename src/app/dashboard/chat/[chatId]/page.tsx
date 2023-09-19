import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { Message, messageArrayValidator } from "@/lib/validations";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { chatId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = params.chatId.split("--");

  if (user.id !== userId1 && user.id !== userId2) notFound();

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;

  const chatPartnerRaw = (await fetchRedis(
    "get",
    `user:${chatPartnerId}`,
  )) as string;
  const chatPartner = JSON.parse(chatPartnerRaw) as User;

  return { title: `ChatMe | ${chatPartner.name} chat` };
}

interface pageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const result: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1,
    );

    const dbMessages = result.map((message) => JSON.parse(message) as Message);
    const reversedDbMessages = dbMessages.reverse();
    const messages = messageArrayValidator.parse(reversedDbMessages);
    // const messages = messageArrayValidator.parse(dbMessages);

    return messages;
  } catch (error) {
    notFound();
  }
}

const page: React.FC<pageProps> = async ({ params }) => {
  const { chatId } = params;

  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = chatId.split("--");

  if (user.id !== userId1 && user.id !== userId2) notFound();

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;

  const chatPartnerRaw = (await fetchRedis(
    "get",
    `user:${chatPartnerId}`,
  )) as string;
  const chatPartner = JSON.parse(chatPartnerRaw) as User;

  const initialMessages = await getChatMessages(chatId);

  return (
    // <div className="flex h-full max-h-[calc(100vh-6rem)] flex-col justify-between">
    <div className="flex h-full flex-col justify-between pt-2 md:pt-0">
      <div className="flex items-center gap-3 border-b border-gray-300 bg-white p-4 py-3">
        <div className="relative h-8 w-8 sm:h-12 sm:w-12">
          <Image
            fill
            referrerPolicy="no-referrer"
            src={chatPartner.image}
            alt={`${chatPartner.name} profile picture`}
            className="rounded-full"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-md font-semibold text-gray-700">
            {chatPartner.name}
          </span>
          <span className="text-xs text-gray-600">{chatPartner.email}</span>
        </div>
      </div>

      <Messages
        initialMessages={initialMessages}
        sessionId={user.id}
        sessionImg={user.image}
        chatPartner={chatPartner}
        chatId={chatId}
      />

      <ChatInput chatPartner={chatPartner} chatId={chatId} />
    </div>
  );
};

export default page;
