"use client";

import React, { useCallback, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FiAlertTriangle } from "react-icons/fi";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/modals/modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { useConversation } from "@/hooks";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);

    axios
      .delete(`/api/conversations/${conversationId}`)
      .then(() => {
        onClose();
        router.push("/conversations");
        router.refresh();
      })
      .catch(() =>
        toast({
          title: "Something went wrong!",
          description: "Failed to delete conversation. Please try again.",
          variant: "destructive",
        })
      )
      .finally(() => setIsLoading(false));
  }, [router, conversationId, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <FiAlertTriangle
            className="h-6 w-6 text-red-600"
            aria-hidden="true"
          />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <Dialog.Title
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-300"
          >
            Delete conversation
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this conversation? This action
              cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-row-reverse gap-x-3 sm:mt-4">
        <Button
          disabled={isLoading}
          className={buttonVariants({ variant: "destructive" })}
          onClick={onDelete}
          type="button"
          aria-label="Delete conversation"
        >
          {isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Delete
        </Button>
        <Button
          disabled={isLoading}
          className={buttonVariants({ variant: "secondary" })}
          onClick={onClose}
          type="button"
          aria-label="Cancel deletion and close modal"
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
