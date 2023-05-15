"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export function AuthHeader() {
  const pathname = usePathname();
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <Image
        height="48"
        width="48"
        className="mx-auto w-auto"
        src="/images/logo.png"
        alt="Logo"
      />
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-300">
        {pathname === "/login" && "Sign in to your account"}
        {pathname === "/register" && "Create an account"}
      </h2>
    </div>
  );
}
