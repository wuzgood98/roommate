"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

export function ModeToggle({ isOnSidebar = false }: { isOnSidebar?: boolean }) {
  const { setTheme, theme } = useTheme();

  return (
    <div
      className={cn(
        isOnSidebar ? "flex-col" : "flex-row",
        "flex gap-2 rounded-full border p-1"
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 px-0"
        onClick={() => setTheme("light")}
      >
        <Icons.sun
          className={cn(
            "scale-100 rounded-full",
            theme === "system" && "bg-transparent",
            theme === "light" && "bg-gray-100",
            theme === "dark" && "bg-transparent"
          )}
        />
        <span className="sr-only">Light</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 px-0"
        onClick={() => setTheme("dark")}
      >
        <Icons.moon
          className={cn(
            "absolute rounded-full",
            theme === "system" && "bg-transparent",
            theme === "light" && "bg-transparent dark:bg-transparent",
            theme === "dark" && "dark:bg-gray-100 dark:bg-opacity-40"
          )}
        />
        <span className="sr-only">Dark</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 px-0"
        onClick={() => setTheme("system")}
      >
        <Icons.laptop
          className={cn(
            theme === "system"
              ? "bg-gray-100 dark:bg-gray-100 dark:bg-opacity-40"
              : "bg-transparent",
            "rounded-full"
          )}
        />
        <span className="sr-only">System</span>
      </Button>
    </div>
  );
}
