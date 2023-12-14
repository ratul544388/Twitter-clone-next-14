"use client";

import { User } from "@prisma/client";
import Header from "../../../../_components/header";
import { UserList } from "../../../../_components/user-list";

interface WhoToFollowClientProps {
  currentUser: User;
}

export const WhoToFollowClient = ({ currentUser }: WhoToFollowClientProps) => {
  return (
    <div className="flex flex-col">
      <Header showBackButton label="People to follow" border />
      <h1 className="font-bold text-2xl px-3 py-2">Suggested for you</h1>
      <UserList
        currentUser={currentUser}
        type="WHO_TO_FOLLOW"
        hasBio
        hasFollowButton
      />
    </div>
  );
};
