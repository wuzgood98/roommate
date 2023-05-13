import { UserAuthForm } from "@/components/user-auth-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return <UserAuthForm />;
}
