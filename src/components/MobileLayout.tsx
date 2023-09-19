"use client";

import { cn } from "@/lib/utils";
import { Dialog, Transition } from "@headlessui/react";
import { Menu, X } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, Fragment, useEffect, useState } from "react";
import FriendRequestSidebarOption from "./FriendRequestSidebarOption";
import { Icons } from "./Icons";
import SidebarChatList from "./SidebarChatList";
import SignOutButton from "./SignOutButton";
import Button, { buttonVariants } from "./ui/Button";

interface MobileChatLayoutProps {
  friends: User[];
  session: Session;
  unseenRequestCount: number;
}

const MobileChatLayout: FC<MobileChatLayoutProps> = ({
  friends,
  session,
  unseenRequestCount,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="fixed inset-x-0 top-0 border-b border-zinc-200 bg-purple-500 px-4 py-2">
      <div className="flex w-full items-center justify-between">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "hover:bg-transparent",
          )}
        >
          <Icons.Logo className="h-6 w-auto text-white" />
        </Link>
        <Button onClick={() => setOpen(true)} className="gap-4">
          Menu <Menu className="h-6 w-6" />
        </Button>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-hidden bg-purple-500 px-6 py-6 shadow-xl">
                      <div className="">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-white">
                            Dashboard
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <X className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <nav className="mt-5 flex-1">
                        <ul
                          role="list"
                          className="flex h-full flex-col gap-y-7"
                        >
                          {/* Chats */}

                          <li>
                            <SidebarChatList
                              initialFriends={friends}
                              sessionId={session.user.id}
                            />
                          </li>

                          {/* Overview */}
                          <li>
                            <div className="text-xs font-semibold text-white">
                              Overview
                            </div>
                            <ul role="list" className="-mx-2 mt-2 space-y-1">
                              {/* Add Friend */}
                              <li>
                                <Link
                                  href="/dashboard/add"
                                  className="group flex items-center gap-3 rounded-md p-2 text-sm font-semibold text-white hover:bg-white hover:text-purple-600"
                                  onClick={() => setOpen(false)}
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
                                  onClick={() => setOpen(false)}
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
                                <span aria-hidden="true">
                                  {session.user.name}
                                </span>
                                <span aria-hidden="true" className="text-xs">
                                  {session.user.email}
                                </span>
                              </div>
                            </div>

                            <SignOutButton className="text-white" />
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default MobileChatLayout;
