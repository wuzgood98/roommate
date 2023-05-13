"use client";

import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useConversation } from "@/hooks";
import { CloudinaryButton } from "@/components/cloudinary-button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Form = () => {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios.post("/api/messages", {
      ...data,
      conversationId: conversationId,
    });
  };

  const handleUpload = (result: any) => {
    axios.post("/api/messages", {
      image: result?.info?.secure_url,
      conversationId: conversationId,
    });
  };

  return (
    <div className="sticky bottom-0 z-30 flex w-full items-center gap-2 border-t bg-white px-4 py-4 lg:gap-4">
      <CloudinaryButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="wkf6uw61"
        type="button"
        aria-label="Upload image"
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CloudinaryButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full items-center gap-2 lg:gap-4"
      >
        <div className="relative w-full">
          <Input
            autoCapitalize="on"
            autoComplete="message"
            {...register("message", { required: true })}
            id="message"
            type="text"
            placeholder="Write a message"
            className={cn(
              "rounded-full bg-neutral-100 font-light text-black focus:outline-none"
            )}
          />
        </div>
        <button
          type="submit"
          aria-label="Send message"
          className="rounded-full bg-sky-500 p-2 transition-colors hover:bg-sky-600"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};
