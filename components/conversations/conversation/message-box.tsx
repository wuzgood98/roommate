"use client";

import { FullMessageType } from "@/types";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

import { Avatar } from "@/components/avatar";
import { cn } from "@/lib/utils";
import { ImageModal } from "./image-modal";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

export const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);

  const isOwn = session.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  const container = cn("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = cn(isOwn && "order-2");
  const body = cn("flex flex-col gap-2", isOwn && "items-end");
  const message = cn(
    "text-sm w-fit max-w-[13.5rem] sm:max-w-[15rem] overflow-hidden",
    isOwn
      ? "bg-sky-500 text-white"
      : "bg-gray-100 dark:text-gray-300 dark:bg-neutral-500 dark:bg-opacity-40",
    data.image ? "rounded-md p-0" : "rounded-lg py-2 px-3"
  );

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data.sender.name}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-300">
            {format(new Date(data.createdAt), "p")}
          </p>
        </div>
        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              alt="Image"
              height="288"
              width="288"
              onClick={() => setImageModalOpen(true)}
              src={data.image}
              className="translate cursor-pointer object-cover transition-transform hover:scale-110"
            />
          ) : (
            <p>{data.body}</p>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <p className="text-xs font-light text-gray-500 dark:text-gray-300">
            {`Seen by ${seenList}`}
          </p>
        )}
      </div>
    </div>
  );
};
