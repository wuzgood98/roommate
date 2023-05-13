"use client";

import { User } from "@prisma/client";
import { useActiveList } from "@/hooks";
import Image from "next/image";

interface AvatarProps {
  user?: User;
}

export const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1;

  return (
    <div className="relative">
      <div className="relative inline-block h-9 w-9 overflow-hidden rounded-full md:h-11 md:w-11">
        <Image
          height={100}
          width={100}
          src={user?.image || "/images/placeholder.jpg"}
          alt="Avatar"
          priority
        />
      </div>
      {isActive && (
        <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white md:h-3 md:w-3" />
      )}
    </div>
  );
};
