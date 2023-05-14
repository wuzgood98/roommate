"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { User } from "@prisma/client";
import { CldUploadButton } from "next-cloudinary";
import { toast } from "../ui/use-toast";
import Image from "next/image";
import { Modal } from "../modals/modal";
import { Label } from "../ui/label";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { CloudinaryButton } from "../cloudinary-button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "../icons";
import { updatedUserSchema } from "@/lib/validations/updatedUser";

type FormData = z.infer<typeof updatedUserSchema>;

type SettingsModalProps = {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: User;
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(updatedUserSchema),
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  const image = watch("image");

  const handleUpload = (result: any) => {
    setValue("image", result?.info?.secure_url, {
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/settings", data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() =>
        toast({ description: "Something went wrong!", variant: "destructive" })
      )
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-300">
            Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Edit your public information.
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
                autoCorrect="off"
                autoCapitalize="none"
                autoComplete="name"
                disabled={isLoading}
                {...register("name", { required: true })}
                id="name"
                type="text"
                name="name"
                className={cn(errors["name"] && "focus:ring-rose-500", "mt-1")}
              />
            </div>
            <div>
              <Label
                htmlFor="photo"
                className={cn("leading-6 text-gray-900 dark:text-gray-300")}
              >
                Photo
              </Label>
              <div className="mt-2 flex items-center gap-x-3">
                <Image
                  width="48"
                  height="48"
                  className="h-auto w-auto rounded-full"
                  src={image || currentUser?.image || "/images/placeholder.jpg"}
                  alt="Avatar"
                  priority
                />
                <div className={buttonVariants({ variant: "secondary" })}>
                  <CloudinaryButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset="wkf6uw61"
                    type="button"
                    aria-label="Change profile photo"
                  >
                    Change
                  </CloudinaryButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            type="button"
            disabled={isLoading}
            onClick={onClose}
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
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};
