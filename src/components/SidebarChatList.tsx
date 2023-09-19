"use client";

import { pusherClient } from "@/lib/pusher";
import { chatIdConstructor, toPusherChannel } from "@/lib/utils";
import { Message } from "@/lib/validations";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";

interface SidebarChatListProps {
  initialFriends: User[];
  sessionId: string;
}

interface ExtendedMessage extends Message {
  senderImage: string;
  senderName: string;
}

const SidebarChatList: React.FC<SidebarChatListProps> = ({
  initialFriends,
  sessionId,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [friends, setFriends] = useState<User[]>(initialFriends);

  useEffect(() => {
    if (pathname.includes("chat")) {
      setUnseenMessages((prev) =>
        prev.filter(
          (unseenMessage) => !pathname.includes(unseenMessage.senderId),
        ),
      );
    }
  }, [pathname]);

  useEffect(() => {
    function newMessageHandler(message: ExtendedMessage) {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatIdConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) return;

      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderName={message.senderName}
          senderImage={message.senderImage}
          message={message.text}
        />
      ));

      setUnseenMessages((prev) => [...prev, message]);
    }

    function newFriendHandler(newFriend: User) {
      setFriends((prev) => [...prev, newFriend]);
    }

    pusherClient.subscribe(toPusherChannel(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherChannel(`user:${sessionId}:friends`));

    pusherClient.bind("new-message", newMessageHandler);
    pusherClient.bind("new-friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherChannel(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherChannel(`user:${sessionId}:friends`));

      pusherClient.unbind("new-message", newMessageHandler);
      pusherClient.unbind("new-friend", newFriendHandler);
    };
  }, [pathname, sessionId, router]);

  return (
    <>
      {friends.length > 0 && (
        <div className="text-xs font-semibold text-white">Your chats</div>
      )}
      <ul
        role="list"
        className="-mx-2 mt-2 max-h-[25rem] space-y-1 overflow-y-auto"
      >
        {friends.sort().map((friend) => {
          const unseenMessagesCount = unseenMessages.filter(
            (unseenMessage) => unseenMessage.senderId === friend.id,
          ).length;

          return (
            <li key={friend.id}>
              <a
                href={`/dashboard/chat/${chatIdConstructor(
                  sessionId,
                  friend.id,
                )}`}
                className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-900 hover:bg-purple-100 hover:text-purple-700"
              >
                {friend.name}
                {unseenMessagesCount > 0 && (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-sm font-medium text-purple-700 group-hover:bg-purple-600 group-hover:text-white">
                    {unseenMessagesCount}
                  </div>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default SidebarChatList;
