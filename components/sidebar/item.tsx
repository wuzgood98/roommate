import { cn } from "@/lib/utils";
import Link from "next/link";

interface ItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

export const Item: React.FC<ItemProps> = ({
  label,
  href,
  icon: Icon,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  let bodyContent: JSX.Element;

  if (label === "Logout") {
    bodyContent = (
      <button
        type="button"
        aria-label={label}
        onClick={handleClick}
        className="group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-gray-500 hover:bg-gray-100 hover:text-black dark:bg-opacity-40 dark:hover:bg-neutral-600 dark:hover:bg-opacity-40 dark:hover:text-gray-200"
      >
        <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </button>
    );
  } else {
    bodyContent = (
      <Link
        href={href}
        aria-label={label}
        className={cn(
          "group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-gray-500 hover:bg-gray-100 hover:text-black dark:bg-opacity-40 dark:hover:bg-neutral-600 dark:hover:bg-opacity-40 dark:hover:text-gray-200",
          active &&
            "bg-gray-100 text-black dark:bg-neutral-500 dark:text-gray-100"
        )}
      >
        <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </Link>
    );
  }

  return <li className="list-none">{bodyContent}</li>;
};
