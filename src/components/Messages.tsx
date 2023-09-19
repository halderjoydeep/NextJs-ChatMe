"use client";
import { pusherClient } from "@/lib/pusher";
import { cn, formatTimestamp, toPusherChannel } from "@/lib/utils";
import { Message } from "@/lib/validations";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
  sessionImg: string | null | undefined;
  chatPartner: User;
  chatId: string;
}

const Messages: React.FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  sessionImg,
  chatPartner,
  chatId,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function messageHandler(newMessage: Message) {
      setMessages((prev) => [newMessage, ...prev]);
    }

    pusherClient.subscribe(toPusherChannel(`chat:${chatId}:messages`));
    pusherClient.bind("messages", messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherChannel(`chat:${chatId}:messages`));
      pusherClient.unbind("messages", messageHandler);
    };
  }, [chatId]);

  return (
    <div className="scrollbar-thumb-blue scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-rounded flex flex-1 flex-col-reverse gap-4 overflow-y-auto scroll-smooth p-3">
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;
        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === message.senderId;

        return (
          <div
            key={`${message.id}-${message.timestamp}`}
            className={cn("flex items-end", { "justify-end": isCurrentUser })}
          >
            {/* Message */}

            <div
              className={cn(
                "mx-2 inline-block max-w-xs break-words rounded-lg px-4 py-2",
                {
                  "bg-purple-600 text-white": isCurrentUser,
                  "order-2 bg-white text-gray-900": !isCurrentUser,
                  "rounded-br-none":
                    !hasNextMessageFromSameUser && isCurrentUser,
                  "rounded-bl-none":
                    !hasNextMessageFromSameUser && !isCurrentUser,
                },
              )}
            >
              {message.text}{" "}
              <span
                className={cn("ml-2 text-xs", {
                  "text-gray-300": isCurrentUser,
                  "text-gray-400": !isCurrentUser,
                })}
              >
                {formatTimestamp(message.timestamp)}
              </span>
            </div>

            {/* Image */}
            <div
              className={cn("relative h-6 w-6", {
                "order-1": !isCurrentUser,
                invisible: hasNextMessageFromSameUser,
              })}
            >
              <Image
                fill
                src={isCurrentUser ? (sessionImg as string) : chatPartner.image}
                alt="Profile picture"
                referrerPolicy="no-referrer"
                className="rounded-full"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
