"use client";

import { useRoutes, useConversation } from "@/hooks";
import { Item } from "./item";

export function MobileFooter() {
  const routes = useRoutes();
  const { isOpen } = useConversation();

  if (isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-0 z-40 flex w-full items-center justify-between border-t bg-white lg:hidden">
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
