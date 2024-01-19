"use client";
import { useModal } from "@/hooks/use-modal-store";
import { useRoutes } from "@/hooks/use-routes";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaFeather } from "react-icons/fa";
import Icon from "../icon";
import { Button } from "../ui/button";
import UserButton from "./user-button";
import { ThemeToggler } from "../theme-toggler";

interface SidebarProps {
  className?: string;
  currentUser: User;
}

const Sidebar: React.FC<SidebarProps> = ({ className, currentUser }) => {
  const routes = useRoutes({ currentUser });
  const { onOpen } = useModal();

  return (
    <div className={cn("border-r", className)}>
      <div className="sticky h-screen inset-y-0 left-0 flex flex-col items-center sm:items-end xl:items-start sm:px-5 px-1 py-1 overflow-y-auto scrollbar-thin">
        <div className="flex flex-col xl:w-full h-full">
          <Link href="/">
            <Icon
              icon={AiOutlineTwitter}
              className="p-3 hover:bg-sky-500/5 text-primary"
              iconSize={28}
            />
          </Link>
          {routes.map((route) => (
            <Link
              href={route.href}
              key={route.label}
              className={cn(
                "flex w-fit capitalize xl:w-auto items-center gap-4 xl:py-2.5 px-3 py-3 hover:bg-blue-50 dark:hover:bg-accent/40 rounded-full text:md cursor-pointer opacity-90 font-medium",
                route.active && "opacity-100 font-semibold"
              )}
            >
              <route.icon size={28} />
              <p className="hidden xl:block">{route.label}</p>
            </Link>
          ))}
          <Button
            onClick={() => onOpen("tweetModal")}
            className="p-0 rounded-full min-h-[52px] min-w-[52px] xl:h-auto xl:w-auto py-3 mt-2 hover:bg-sky-500/90 font-semibold"
          >
            <p className="hidden xl:block">Tweet</p>
            <FaFeather size={18} className="xl:hidden" />
          </Button>
          <div className="mt-auto pt-5 flex flex-col gap-2 items-center xl:items-start">
            <ThemeToggler className="xl:ml-2" />
            <UserButton currentUser={currentUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
