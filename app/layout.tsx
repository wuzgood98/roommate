import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import AuthContext from "@/context/auth-context";
import { ActiveStatus } from "@/components/active-status";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

export const metadata = {
  title: "Whiteroom",
  description:
    "Whiteroom A a messaging web app designed to streamline communication for individuals and teams. With its user-friendly interface and robust features, it offers a convenient platform for connecting and engaging with others. Whether you're chatting one-on-one, collaborating on projects, or staying connected with friends and colleagues, Whiteroom provides a secure and intuitive environment. Enjoy organized conversations, file sharing, and personalized settings, all aimed at enhancing your messaging experience. Simplify your communication and foster meaningful connections with Whiteroom.",
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Radix UI",
    "Messaging",
  ],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthContext>
            {children}
            <Toaster />
            <ActiveStatus />
            <TailwindIndicator />
          </AuthContext>
        </ThemeProvider>
      </body>
    </html>
  );
}
