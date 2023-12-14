"use client";

import Header from "@/app/(main)/_components/header";
import { UserList } from "@/app/(main)/_components/user-list";
import { formatText } from "@/app/helper";
import { QueryType } from "@/types";
import { User } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FollowersClientProps {
  user: User;
  active: QueryType;
}

export const FollowersClient = ({ user, active }: FollowersClientProps) => {
  const pathname = usePathname();
  const navigations: QueryType[] = ["FOLLOWERS", "FOLLOWINGS"];
  const router = useRouter();

  const onChange = (value: string) => {
    router.push(`/${user.username}/${value.toLowerCase()}`);
  };

  return (
    <>
      <Header
        navigations={navigations}
        active={active}
        onChange={(value) => onChange(value)}
        showBackButton
        label={formatText(active)}
        border
      />
      <UserList type={active} hasFollowButton hasBio userId={user.id} />
    </>
  );
};
