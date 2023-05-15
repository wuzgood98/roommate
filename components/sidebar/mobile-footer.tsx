"use client";

import { useRoutes, useConversation } from "@/hooks";
import { Item } from "./item";
import { Avatar } from "../avatar";
import { User } from "@prisma/client";
import useSettingsModal from "@/hooks/useSettingsModal";

export function MobileFooter({ currentUser }: { currentUser: User }) {
  const routes = useRoutes();
  const { isOpen } = useConversation();
  const { open } = useSettingsModal();

  if (isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-0 z-40 flex w-full items-center justify-between border-t bg-background px-3 py-2 lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => open()}
        className="transition-opacity hover:opacity-75"
      >
        <Avatar user={currentUser} />
      </button>
      {routes.map((route) => (
        <Item
          label={route.label}
          key={route.href}
          href={route.href}
          active={route.active}
          icon={route.icon}
          onClick={route.onClick}
        />
      ))}
    </div>
  );
}
