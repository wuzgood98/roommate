"use client";

import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { toast } from "../ui/use-toast";
import { Modal } from "./modal";
import { Icons } from "../icons";

interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: User[];
}

export const GroupChatModal: React.FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  users = [],
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = watch("members");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/conversations", {
        ...data,
        isGroup: true,
      })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() =>
        toast({ title: "Something went wrong!", variant: "destructive" })
      )
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-300">
            Create a group chat
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Create a chat with more than 2 people.
          </p>
          <div className="mt-10 flex flex-col gap-y-8">
            <div>
              <Label
                htmlFor="name"
                className={cn("text-gray-900 dark:text-gray-300")}
              >
                Name
              </Label>
              <Input
                disabled={isLoading}
                {...register("name", { required: true })}
                id="name"
                type="text"
                className={cn(errors["name"] && "focus:ring-rose-500")}
              />
            </div>
            <Select
              disabled={isLoading}
              label="Members"
              options={users.map((user) => ({
                value: user.id,
                label: user.name,
              }))}
              onChange={(value) =>
                setValue("members", value, {
                  shouldValidate: true,
                })
              }
              value={members}
            />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            disabled={isLoading}
            onClick={onClose}
            type="button"
            aria-label="Close modal"
            className={buttonVariants({ variant: "secondary" })}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            {isLoading && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};
