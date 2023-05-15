import { getCurrentUser } from "@/actions/getCurrentUser";
import { DesktopSidebar } from "./desktop-sidebar";
import { MobileFooter } from "./mobile-footer";

export async function Sidebar({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter currentUser={currentUser!} />
      <main className="h-full lg:pl-20">{children}</main>
    </div>
  );
}
