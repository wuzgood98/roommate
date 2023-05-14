"use client";

import { User } from "@prisma/client";
import { UserBox } from "./user-box";

interface UserListProps {
  items: User[];
}

export const UserList: React.FC<UserListProps> = ({ items }) => {
  return (
    <aside className="fixed inset-y-0 left-0 block w-full overflow-y-auto border-r border-gray-200 dark:border-gray-800 pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0">
      <div className="px-5">
        <div className="flex-col">
          <h2 className="py-4 text-2xl font-bold text-neutral-800 dark:text-neutral-300">People</h2>
        </div>
        {items.map((item) => (
          <UserBox key={item.id} user={item} />
        ))}
      </div>
    </aside>
  );
};
