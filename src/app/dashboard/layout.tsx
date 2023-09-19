import FriendRequestSidebarOption from "@/components/FriendRequestSidebarOption";
import { Icons } from "@/components/Icons";
import MobileChatLayout from "@/components/MobileLayout";
import SidebarChatList from "@/components/SidebarChatList";
import SignOutButton from "@/components/SignOutButton";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const unseenRequestCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:requests`,
    )) as string[]
  ).length;

  const friends = await getFriendsByUserId(session.user.id);

  return (
    <main className="flex h-screen w-full">
      <div className="md:hidden">
        <MobileChatLayout
          session={session}
          friends={friends}
          unseenRequestCount={unseenRequestCount}
        />
      </div>

      <aside className=" hidden w-full max-w-sm flex-col gap-y-5 bg-purple-600 px-6 py-8 md:flex">
        <Link href="/dashboard" className="self-start">
          <Icons.Logo className="h-8 text-white" />
        </Link>

        <nav className="mt-5 flex-1">
          <ul role="list" className="flex h-full flex-col gap-y-7">
            {/* Chats */}

            <li>
              <SidebarChatList
                initialFriends={friends}
                sessionId={session.user.id}
              />
            </li>

            {/* Overview */}
            <li>
              <div className="text-xs font-semibold text-white">Overview</div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {/* Add Friend */}
                <li>
                  <Link
                    href="/dashboard/add"
                    className="group flex items-center gap-3 rounded-md p-2 text-sm font-semibold text-white hover:bg-white hover:text-purple-600"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-white bg-white text-purple-600 group-hover:border-purple-600 group-hover:bg-purple-600 group-hover:text-white">
                      <Icons.UserPlus className="h-4 w-4" />
                    </div>
                    <p className="truncate">Add Friend</p>
                  </Link>
                </li>

                {/* Friend Requests */}
                <li>
                  <FriendRequestSidebarOption
                    initialUnseenRequestCount={unseenRequestCount}
                    sessionId={session.user.id}
                  />
                </li>
              </ul>
            </li>

            {/* Profile */}
            <li className="mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-4">
                <div className="relative h-8 w-8">
                  <Image
                    src={session.user.image || ""}
                    fill
                    priority
                    referrerPolicy="no-referrer"
                    alt="Your Profile Picture"
                    className="rounded-full"
                  />
                </div>
                <span className="sr-only">Your Profile</span>
                <div className="flex flex-col text-sm font-semibold leading-6 text-white">
                  <span aria-hidden="true">{session.user.name}</span>
                  <span aria-hidden="true" className="text-xs">
                    {session.user.email}
                  </span>
                </div>
              </div>

              <SignOutButton className="text-white" />
            </li>
          </ul>
        </nav>
      </aside>
      <section className="max-h-screen w-full bg-purple-200 pt-12 md:pt-0">
        {children}
      </section>
    </main>
  );
};

export default Layout;
