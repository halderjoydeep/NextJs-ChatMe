"use client";
import { User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface FriendRequestSidebarOptionProps {
  initialUnseenRequestCount: number;
  sessionId: string;
}

const FriendRequestSidebarOption: React.FC<FriendRequestSidebarOptionProps> = ({
  initialUnseenRequestCount,
  sessionId,
}) => {
  const [unSeenRequestCount, setUnseenRequestCount] = useState(
    initialUnseenRequestCount,
  );

  return (
    <Link
      href="/dashboard/requests"
      className="group flex items-center gap-3 rounded-md p-2 text-sm font-semibold text-white hover:bg-white hover:text-purple-600"
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-white bg-white text-purple-600 group-hover:border-purple-600 group-hover:bg-purple-600 group-hover:text-white">
        <User className="h-4 w-4" />
      </div>
      <p className="truncate">Friend requests</p>

      {unSeenRequestCount > 0 && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 group-hover:text-white">
          {unSeenRequestCount}
        </div>
      )}
    </Link>
  );
};

export default FriendRequestSidebarOption;
