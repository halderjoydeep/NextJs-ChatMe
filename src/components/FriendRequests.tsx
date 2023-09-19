"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherChannel } from "@/lib/utils";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FriendRequestsProps {
  initialRequests: IncomingRequest[];
  sessionId: string;
}

const FriendRequests: React.FC<FriendRequestsProps> = ({
  initialRequests,
  sessionId,
}) => {
  const router = useRouter();
  const [incomingRequests, setIncomingRequests] =
    useState<IncomingRequest[]>(initialRequests);

  async function acceptFriend(id: string) {
    await axios.post("/api/friends/accept", { id });
    setIncomingRequests((prev) => prev.filter((request) => request.id !== id));
    router.refresh();
  }

  async function rejectFriend(id: string) {
    await axios.post("/api/friends/reject", { id });
    setIncomingRequests((prev) => prev.filter((request) => request.id !== id));
    router.refresh();
  }

  useEffect(() => {
    function friendRequestHandler(newRequest: IncomingRequest) {
      setIncomingRequests((prev) => [...prev, newRequest]);
    }

    pusherClient.subscribe(toPusherChannel(`user:${sessionId}:requests`));
    pusherClient.bind("requests", friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(toPusherChannel(`user:${sessionId}:requests`));
      pusherClient.unbind("requests", friendRequestHandler);
    };
  }, [sessionId]);

  return (
    <div className="flex flex-col gap-4">
      {incomingRequests.length === 0 ? (
        <p className="text-sm">Nothing to show here...</p>
      ) : (
        incomingRequests.map((request) => (
          <div key={request.id} className="flex items-center gap-4">
            <UserPlus />
            <p className=" text-xs font-medium md:text-lg">{request.email}</p>
            <button
              onClick={() => acceptFriend(request.id)}
              aria-label="accept friend request"
              className="grid h-6 w-6 place-items-center rounded-full bg-lime-600 transition hover:bg-lime-700 hover:shadow-md md:h-8 md:w-8"
            >
              <Check className="h-3/4 w-3/4 font-medium text-white" />
            </button>

            <button
              onClick={() => rejectFriend(request.id)}
              aria-label="reject friend request"
              className="grid h-6 w-6 place-items-center rounded-full bg-red-600 transition hover:bg-red-700 hover:shadow-md md:h-8 md:w-8"
            >
              <X className="h-3/4 w-3/4 font-medium text-white" />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendRequests;
