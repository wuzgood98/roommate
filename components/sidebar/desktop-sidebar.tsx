"use client";

import { useRoutes } from "@/hooks";
import { User } from "@prisma/client";
import { useState } from "react";
import { Avatar } from "../avatar";
import { Item } from "./item";
import { SettingsModal } from "./settings-modal";
import { ModeToggle } from "../mode-toggle";
import useSettingsModal from "@/hooks/useSettingsModal";

interface DesktopSidebarProps {
  currentUser: User;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentUser,
}) => {
  const routes = useRoutes();
  const { isOpen, close, open } = useSettingsModal();

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => close()}
      />
      <div className="hidden justify-between bg-background lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-20 lg:flex-col lg:overflow-y-auto lg:border-r lg:pb-4 xl:px-6">
        <nav className="mt-4 flex flex-col justify-between">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {routes.map((item) => (
              <Item
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav className="mt-4 flex flex-col items-center justify-between gap-y-4">
          <ModeToggle isOnSidebar />
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => open()}
            className="transition-opacity hover:opacity-75"
          >
            <Avatar user={currentUser} />
          </button>
        </nav>
      </div>
    </>
  );
};
