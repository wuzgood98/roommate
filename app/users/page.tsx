import { EmptyState } from "@/components/empty-state";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User",
  description: "A list of users in your circle",
};

export default function Users() {
  return (
    <div className="hidden h-full lg:block lg:pl-80">
      <EmptyState />
    </div>
  );
}
