"use client";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useModal } from "@/hooks/use-modal-store";
import { useRoutes } from "@/hooks/use-routes";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import Icon from "./icon";

export const BottomNavbar = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();
  const routes = useRoutes({ isBottomNavbar: true });
  const { onOpen } = useModal();

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;
    setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 60);
    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

  return (
    <div
      className={`navbar ${
        visible ? "translate-y-0" : "translate-y-full"
      } bg-background xs:hidden shadow-lg flex items-center justify-between border-t p-1 fixed bottom-0 w-full transition-transform duration-300 ease-in-out`}
    >
      {routes.map((route) => (
        <Link href={route.href} key={route.href}>
          <div className="py-3 px-4 hover:bg-sky-500/5 rounded-3xl">
            <route.icon size={22} />
          </div>
        </Link>
      ))}
      <Icon
        icon={Plus}
        iconSize={34}
        onClick={() => onOpen("tweetModal")}
        className={cn(
          "fixed bottom-[80px] right-6 bg-primary text-white hover:bg-sky-500/80 p-3 opacity-0 pointer-events-none scale-0 transition-all duration-300",
          visible && "opacity-100 pointer-events-auto scale-100"
        )}
      />
    </div>
  );
};
