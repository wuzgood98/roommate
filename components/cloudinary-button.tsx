"use client";
import * as React from "react";

import { CldUploadButtonProps, CldUploadButton } from "next-cloudinary";

type CldButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  CldUploadButtonProps;

export const CloudinaryButton = React.forwardRef<
  HTMLButtonElement,
  CldButtonProps
>(({ className, ...props }, ref) => {
  return <CldUploadButton {...props} />;
});
CloudinaryButton.displayName = "CloudinaryButton";
