import { getCurrentUser } from "@/actions/getCurrentUser";
import { ModeToggle } from "@/components/mode-toggle";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  if (user) {
    redirect("/conversations");
  }

  return (
    <main className="flex min-h-[100dvh] min-h-[100vh] w-full flex-col items-center justify-center space-y-4 bg-gray-100 py-12 dark:bg-background px-6">
      <div className="mx-auto max-w-sm">
        <Image
          height="2048"
          width="2048"
          className="h-auto w-auto"
          src="/images/logo.png"
          alt="Logo"
        />
      </div>
      <ModeToggle />
    </main>
  );
}
