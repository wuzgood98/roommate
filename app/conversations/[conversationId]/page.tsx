import { getConversationById } from "@/actions/getConversationById";
import { getMessages } from "@/actions/getMessages";
import { Body } from "@/components/conversations/conversation/body";
import { Form } from "@/components/conversations/conversation/form";
import { Header } from "@/components/conversations/conversation/header";
import { EmptyState } from "@/components/empty-state";

export default async function Conversation({
  params,
}: {
  params: { conversationId: string };
}) {
  const { conversationId } = params;
  const conversation = await getConversationById(conversationId);
  const messages = await getMessages(conversationId);

  if (!conversation) {
    return (
      <div className="h-full lg:pl-80">
        <div className="flex h-full flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full lg:pl-80">
      <div className="flex h-full flex-col">
        <Header conversation={conversation} />
        <Body initialMessages={messages} />
        <Form />
      </div>
    </div>
  );
}
