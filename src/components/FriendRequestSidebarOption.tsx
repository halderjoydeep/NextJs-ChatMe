"use client";
import { pusherClient } from "@/lib/pusher";
import { toPusherChannel } from "@/lib/utils";
import { User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FriendRequestSidebarOptionProps {
  initialUnseenRequestCount: number;
  sessionId: string;
  onClick?: Function;
}

const FriendRequestSidebarOption: React.FC<FriendRequestSidebarOptionProps> = ({
  initialUnseenRequestCount,
  sessionId,
  onClick,
}) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState(
    initialUnseenRequestCount,
  );

  useEffect(() => {
    function friendRequestHandler() {
      setUnseenRequestCount((prev) => prev + 1);
    }

    function newFriendHandler() {
      setUnseenRequestCount((prev) => prev - 1);
    }

    pusherClient.subscribe(toPusherChannel(`user:${sessionId}:requests`));
    pusherClient.subscribe(toPusherChannel(`user:${sessionId}:friends`));
    pusherClient.bind("requests", friendRequestHandler);
    pusherClient.bind("new-friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherChannel(`user:${sessionId}:requests`));
      pusherClient.unsubscribe(toPusherChannel(`user:${sessionId}:friends`));
      pusherClient.unbind("requests", friendRequestHandler);
      pusherClient.unbind("new-friend", newFriendHandler);
    };
  }, [sessionId]);

  return (
    <Link
      href="/dashboard/requests"
      className="group flex items-center gap-3 rounded-md p-2 text-sm font-semibold text-white hover:bg-white hover:text-purple-600"
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-white bg-white text-purple-600 group-hover:border-purple-600 group-hover:bg-purple-600 group-hover:text-white">
        <User className="h-4 w-4" />
      </div>
      <p className="truncate">Friend requests</p>

      {unseenRequestCount > 0 && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 group-hover:text-white">
          {unseenRequestCount}
        </div>
      )}
    </Link>
  );
};

export default FriendRequestSidebarOption;
