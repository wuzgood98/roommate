"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

import useConversation from "@/hooks/useConversation";
import { MessageBox } from "./message-box";
import { FullMessageType } from "@/types";
import { find } from "lodash";
import { pusherClient } from "@/lib/pusher";

interface BodyProps {
  initialMessages: FullMessageType[];
}

export const Body: React.FC<BodyProps> = ({ initialMessages = [] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<FullMessageType[]>(initialMessages);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });

    const messageHandler = (newMessage: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((prevMessages) => {
        if (find(prevMessages, { id: newMessage.id })) {
          return prevMessages;
        }

        return [...prevMessages, newMessage];
      });

      bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((prevMessages) =>
        prevMessages.map((prevMessage) => {
          if (prevMessage.id === newMessage.id) {
            return newMessage;
          }

          return prevMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div className="h-0" ref={bottomRef} />
    </div>
  );
};
