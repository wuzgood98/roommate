"use client";

import { Fragment, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose, IoTrash } from "react-icons/io5";
import { Conversation, User } from "@prisma/client";
import { format } from "date-fns";

import { useOtherUser, useActiveList } from "@/hooks";

import { Avatar } from "@/components/avatar";
import { AvatarGroup } from "@/components/avatar-group";
import { ConfirmModal } from "./confirm-modal";
import { ModeToggle } from "@/components/mode-toggle";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: Conversation & {
    users: User[];
  };
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const otherUser = useOtherUser(data);

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), "PP");
  }, [otherUser.createdAt]);

  const title = useMemo(() => {
    return data.name || otherUser.name;
  }, [data.name, otherUser.name]);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }

    return isActive ? "Online" : "Offline";
  }, [data, isActive]);

  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-150"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-150"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-xs sm:max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-background py-6 shadow-xl dark:border-l">
                      <div className="flex items-start justify-end px-4 sm:px-6">
                        <button
                          type="button"
                          aria-label="Close panel"
                          className="ml-3 flex h-7 items-center rounded-md bg-background text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:text-gray-200"
                          onClick={onClose}
                        >
                          <span className="sr-only">Close panel</span>
                          <IoClose size={24} aria-hidden="true" />
                        </button>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="flex flex-col items-center">
                          <div className="mb-2">
                            {data.isGroup ? (
                              <AvatarGroup users={data.users} />
                            ) : (
                              <Avatar user={otherUser} />
                            )}
                          </div>
                          <p>{title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            {statusText}
                          </p>
                          <div className="my-8 flex gap-10">
                            <button
                              type="button"
                              aria-label="Delete group"
                              onClick={() => setConfirmOpen(true)}
                              className="flex flex-col items-center gap-3 hover:opacity-75 hover:transition-opacity"
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-500 dark:bg-opacity-40">
                                <IoTrash size={20} />
                              </div>
                              <span className="text-sm font-light text-neutral-600 dark:text-neutral-300">
                                Delete
                              </span>
                            </button>
                          </div>
                          <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                            <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                              {data.isGroup && (
                                <div>
                                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 sm:w-40 sm:flex-shrink-0">
                                    Emails
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:col-span-2">
                                    {data.users
                                      .map((user) => user.email)
                                      .join(", ")}
                                  </dd>
                                </div>
                              )}
                              {!data.isGroup && (
                                <div>
                                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 sm:w-40 sm:flex-shrink-0">
                                    Email
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:col-span-2">
                                    {otherUser.email}
                                  </dd>
                                </div>
                              )}
                              {!data.isGroup && (
                                <>
                                  <div
                                    className="h-[1px] w-full bg-gray-200 dark:bg-gray-800"
                                    aria-hidden="true"
                                  />
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 sm:w-40 sm:flex-shrink-0">
                                      Joined
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:col-span-2">
                                      <time dateTime={joinedDate}>
                                        {joinedDate}
                                      </time>
                                    </dd>
                                  </div>
                                </>
                              )}
                            </dl>
                          </div>
                        </div>
                        <div className="absolute inset-x-0 bottom-4 mx-auto max-w-max">
                          <ModeToggle />
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
