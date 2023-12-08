"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FullUserType } from "@/types";
import { Avatar } from "../avatar";
import FollowersInfo from "../followers-info";
import {
  BiEnvelope,
  BiHomeCircle,
  BiSolidEnvelope,
  BiSolidHomeCircle,
} from "react-icons/bi";
import { BsPeople, BsPeopleFill } from "react-icons/bs";
import { FaFeather } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import {
  HiBadgeCheck,
  HiBell,
  HiOutlineBadgeCheck,
  HiOutlineBell,
  HiOutlineUser,
  HiUser,
} from "react-icons/hi";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRoutes } from "@/hooks/use-routes";

interface MobileSidebarProps {
  currentUser: FullUserType;
}

export function MobileSidebar({ currentUser }: MobileSidebarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const routes = useRoutes({ currentUser, isMobileSidebar: true });

  return (
    <div className="xs:hidden">
      <Sheet open={open} onOpenChange={() => setOpen(!open)}>
        <SheetTrigger
          onClick={() => setOpen(true)}
          asChild
          className="h-fit w-fit"
        >
          <Avatar
            image={currentUser.image}
            classname="min-h-[24px] min-w-[24px]"
          />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 flex flex-col py-3">
          <div className="flex items-center gap-3 pl-10">
            <Avatar image={currentUser.image} />
            <div className="flex flex-col text-sm">
              <h1 className="font-semibold">{currentUser.name}</h1>
              <h1 className="text-muted-foreground">@{currentUser.username}</h1>
            </div>
          </div>
          <div className="flex gap-2 pl-10">
            <FollowersInfo user={currentUser} />
          </div>
          <Separator />
          <div className="mt-1 flex flex-col">
            {routes.map((route) => (
              <div
                key={route.label}
                onClick={() => {
                  setOpen(false);
                  router.push(route.href);
                }}
                className="flex items-center hover:bg-sky-500/5 cursor-pointer pl-10 gap-4 py-3 font-medium"
              >
                <route.icon size={28} />
                {route.label}
              </div>
            ))}
          </div>
          <div className="flex flex-col mt-auto w-full">
            <SignOutButton>
              <div
                onClick={() => setOpen(false)}
                className="py-3 hover:bg-sky-500/5 pl-10 flex cursor-pointer items-center gap-4 font-medium"
              >
                <LogOut className="h-6 w-6" />
                Logout
              </div>
            </SignOutButton>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
