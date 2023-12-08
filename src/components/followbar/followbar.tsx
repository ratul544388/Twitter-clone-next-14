"use client";

import { User } from "@prisma/client";
import { SearchInput } from "../search-input";
import WhoToFollowCard from "./who-to-follow-card";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface FollowbarProps {
  currentUser: User;
}

const Followbar: React.FC<FollowbarProps> = ({ currentUser }) => {
  const pathname = usePathname();
  return (
    <aside className="h-screen space-y-3 top-0 inset-y-0 w-full py-1.5 px-4 hidden lg:block">
      <div className={cn(pathname.includes("explore") && "hidden")}>
        <SearchInput currentUser={currentUser} />
      </div>
      <WhoToFollowCard currentUser={currentUser} />
    </aside>
  );
};

export default Followbar;
