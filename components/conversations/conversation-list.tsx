"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import { find, uniq } from "lodash";

import useConversation from "@/hooks/useConversation";
import { pusherClient } from "@/lib/pusher";
import { GroupChatModal } from "@/components/modals/group-chat-modal";
import { ConversationBox } from "./conversation-box";
import { FullConversationType } from "@/types";
import { cn } from "@/lib/utils";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
  title?: string;
  currentUser: User | null;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
  currentUser,
}) => {
  const [items, setItems] = useState<FullConversationType[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const router = useRouter();
  const session = useSession();

  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const newConversationHandler = (newConversation: FullConversationType) => {
      setItems((prevItems) => {
        if (find(prevItems, { id: newConversation.id })) {
          return prevItems;
        }

        return [newConversation, ...prevItems];
      });
    };

    const updateConversationHandler = (
      newConversation: FullConversationType
    ) => {
      setItems((prevItems) =>
        prevItems.map((prevConversation) => {
          if (prevConversation.id === newConversation.id) {
            return {
              ...prevConversation,
              messages: newConversation.messages,
            };
          }

          return prevConversation;
        })
      );
    };

    const deleteConversationHandler = (conversation: FullConversationType) => {
      setItems((prevItems) => [
        ...prevItems.filter((convo) => convo.id !== conversation.id),
      ]);

      if (conversationId === conversation.id) {
        router.push("/conversations");
      }
    };

    pusherClient.bind("conversation:new", newConversationHandler);
    pusherClient.bind("conversation:update", updateConversationHandler);
    pusherClient.bind("conversation:delete", deleteConversationHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newConversationHandler);
      pusherClient.unbind("conversation:update", updateConversationHandler);
      pusherClient.unbind("conversation:delete", deleteConversationHandler);
    };
  }, [pusherKey, conversationId, router]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 overflow-y-auto border-r border-gray-200 pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0",
          isOpen ? "hidden" : "left-0 block w-full"
        )}
      >
        <div className="px-5">
          <div className="mb-4 flex justify-between pt-4">
            <h2 className="text-2xl font-bold text-neutral-800">Messages</h2>
            <button
              type="button"
              aria-label="Add to group"
              onClick={() => setIsModalOpen(true)}
              className="rounded-full bg-gray-100 p-2 text-gray-600 transition-opacity hover:opacity-75"
            >
              <MdOutlineGroupAdd size={20} />
            </button>
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
              currentUser={currentUser}
              users={users}
            />
          ))}
        </div>
      </aside>
    </>
  );
};
