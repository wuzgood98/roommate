"use client";

import { Modal } from "@/components/modals/modal";
import Image from "next/image";

interface ImageModalProps {
  isOpen?: boolean;
  onClose: () => void;
  src?: string | null;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  src,
}) => {
  if (!src) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="h-80 w-[calc(100%-24px)] [@media(max-width:640px)]:w-full">
        <Image
          className="h-full w-full rounded object-cover"
          height={400}
          width={600}
          alt="Image"
          src={src}
          priority
        />
      </div>
    </Modal>
  );
};
