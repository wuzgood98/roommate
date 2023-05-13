"use client";

import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Conversation, User } from "@prisma/client";

import { useOtherUser, useActiveList } from "@/hooks";

import { Avatar } from "@/components/avatar";
import { AvatarGroup } from "@/components/avatar-group";
import { ProfileDrawer } from "./profile-drawer";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

export const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return isActive ? "Online" : "Offline";
  }, [conversation, isActive]);

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="sticky top-0 z-30 flex w-full items-center justify-between border-b bg-white px-4 py-3 shadow-sm sm:px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/conversations"
            aria-label="Go back to conversations"
            className="block cursor-pointer text-sky-500 transition-colors hover:text-sky-600 lg:hidden"
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className="flex flex-col">
            <p>{conversation.name || otherUser.name}</p>
            <p className="text-sm font-light text-neutral-500">{statusText}</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Open drawer"
          onClick={() => setDrawerOpen(true)}
        >
          <HiEllipsisHorizontal
            size={32}
            className="text-sky-500 transition-colors hover:text-sky-600"
          />
        </button>
      </div>
    </>
  );
};
