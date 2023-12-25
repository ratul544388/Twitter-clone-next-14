"use client";

import { UserList } from "@/app/(main)/_components/user-list";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { SearchInput } from "../search-input";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface FollowbarProps {
  currentUser: User;
}

const Followbar: React.FC<FollowbarProps> = ({ currentUser }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  return (
    <aside className="h-screen sticky space-y-3 top-0 inset-y-0 w-full py-1.5 px-4 hidden lg:block">
      <div className={cn(pathname.includes("explore") && "hidden")}>
        <SearchInput
          value={inputValue}
          onChange={(value) => setInputValue(value)}
          onSubmit={() => router.push(`/explore/search/?q=${SearchInput}`)}
          results
        />
      </div>
      <div className="rounded-xl border py-3 bg-background shadow-lg w-full flex flex-col">
        <h1 className="text-xl font-bold p-4 py-0">Who to follow</h1>
        <UserList
          currentUser={currentUser}
          type="WHO_TO_FOLLOW"
          hasFollowButton
          take={6}
          loadOnces
        />
        <Link
          href={`/${currentUser.username}/who-to-follow`}
          className={buttonVariants({
            variant: "link",
          })}
        >
          See more...
        </Link>
      </div>
    </aside>
  );
};

export default Followbar;
