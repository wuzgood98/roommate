import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Get started.",
};

export default function Home() {
  return (
    <main className="flex min-h-[100dvh] min-h-[100vh] w-full flex-col items-center justify-center space-y-4 bg-gray-100 px-6 py-12 dark:bg-background">
      <div className="mx-auto max-w-sm">
        <Image
          height="2048"
          width="2048"
          className="h-auto w-auto"
          src="/images/logo.png"
          alt="Logo"
        />
      </div>
      <Link
        href="/conversations"
        aria-label="Go to conversations page"
        className={cn(buttonVariants())}
      >
        Start a conversation
      </Link>
      <ModeToggle />
    </main>
  );
}
