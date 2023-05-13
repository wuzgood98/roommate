"use client";

import { EmptyState } from "@/components/empty-state";
import { useConversation } from "@/hooks";
import { cn } from "@/lib/utils";

export default function Conversations() {
  const { isOpen } = useConversation();

  return (
    <div
      className={cn("h-full lg:block lg:pl-80", isOpen ? "block" : "hidden")}
    >
      <EmptyState />
    </div>
  );
}
