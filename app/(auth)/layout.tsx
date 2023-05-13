import { AuthHeader } from "@/components/auth-header";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-full flex-col justify-center bg-gray-100 py-12 dark:bg-background sm:px-6 lg:px-8">
      <AuthHeader />
      {children}
    </main>
  );
}
