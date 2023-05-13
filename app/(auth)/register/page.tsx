import { UserAuthForm } from "@/components/user-auth-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
};

export default function LoginPage() {
  return <UserAuthForm isRegisterPage />;
}
