import { getConversations } from "@/actions/getConversations";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { getUsers } from "@/actions/getUsers";
import { ConversationList } from "@/components/conversations/conversation-list";
import { Sidebar } from "@/components/sidebar/sidebar";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  const users = await getUsers();
  const currentUser = await getCurrentUser()

  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <div className="h-full">
        <ConversationList initialItems={conversations} users={users} currentUser={currentUser} />
        {children}
      </div>
    </Sidebar>
  );
}
