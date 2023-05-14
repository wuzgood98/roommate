import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Avatar } from "../avatar";
import { LoadingModal } from "../modals/loading-modal";

interface UserBoxProps {
  user: User;
}

export const UserBox: React.FC<UserBoxProps> = ({ user }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios
      .post("/api/conversations", { userId: user.id })
      .then((user) => {
        router.push(`/conversations/${user.data.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [user, router]);

  return (
    <>
      {isLoading && <LoadingModal />}
      <button
        type="button"
        onClick={handleClick}
        className="relative flex w-full items-center space-x-3 rounded-lg bg-white p-3 hover:bg-neutral-100  hover:transition-colors dark:bg-transparent dark:hover:bg-neutral-600 dark:hover:bg-opacity-40"
      >
        <Avatar user={user} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name}
              </p>
            </div>
          </div>
        </div>
      </button>
    </>
  );
};
