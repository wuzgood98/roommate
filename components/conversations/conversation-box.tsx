"use client";

import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { Avatar } from "@/components/avatar";
import { AvatarGroup } from "@/components/avatar-group";
import { useOtherUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { FullConversationType } from "@/types";
import { User } from "@prisma/client";
import { Icons } from "../icons";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
  currentUser: User | null;
  users: User[];
}

export const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
  currentUser,
  users,
}) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(
    () => session.data?.user?.email,
    [session.data?.user?.email]
  );

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email !== userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  const currentUserIsNotTheAuthorOfLastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages.at(-1)?.senderId !== currentUser?.id;
  }, [data.messages, currentUser?.id]);

  const lastMessageAuthor = useMemo(() => {
    const messages = data.messages || [];

    return users.find((user) => user.id === messages.at(-1)?.senderId)?.name;
  }, [data.messages, users]);

  return (
    <div
      role="button"
      onClick={handleClick}
      aria-label={`Open conversation with ${otherUser.name}`}
      className={cn(
        "relative flex w-full cursor-pointer items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-neutral-100",
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="mb-1 flex items-center justify-between">
            <span
              className="text-md font-medium text-gray-900"
              title={
                data.isGroup
                  ? (data.name as string)
                  : (otherUser.name as string)
              }
            >
              {data.name || otherUser.name}
            </span>
            {lastMessage?.createdAt && (
              <span className="text-xs font-light text-gray-400">
                {format(new Date(lastMessage.createdAt), "p")}
              </span>
            )}
          </div>
          <div className="inline-flex items-center">
            {!currentUserIsNotTheAuthorOfLastMessage && !data.isGroup && (
              <Icons.Seen
                className={cn(
                  "mr-2 h-4 w-4 transition-colors",
                  hasSeen ? "text-blue-400" : "text-gray-600"
                )}
                aria-hidden="true"
              />
            )}

            {!currentUserIsNotTheAuthorOfLastMessage && data.isGroup && (
              <Icons.Seen
                className={cn(
                  "mr-2 h-4 w-4 transition-colors",
                  hasSeen ? "text-blue-400" : "text-gray-600"
                )}
                aria-hidden="true"
              />
            )}

            {currentUserIsNotTheAuthorOfLastMessage &&
              !!lastMessageAuthor?.length &&
              data.isGroup && (
                <span
                  className="mr-1 truncate text-sm text-gray-600"
                  title={lastMessageAuthor}
                >
                  {lastMessageAuthor}
                  {":"}
                </span>
              )}
            {!currentUserIsNotTheAuthorOfLastMessage && data.isGroup && (
              <span className="mr-1 truncate text-sm text-gray-600" title="You">
                You{":"}
              </span>
            )}
            <span
              className="truncate text-sm text-gray-600"
              title={lastMessageText}
            >
              {lastMessageText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
