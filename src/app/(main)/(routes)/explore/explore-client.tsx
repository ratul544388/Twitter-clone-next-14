"use client";

import { User } from "@prisma/client";
import Header from "../../_components/header";
import { FullUserType } from "@/types";

interface SearchClientProps {
  q: string;
  currentUser: FullUserType;
}

export const ExploreClient = ({ q, currentUser }: SearchClientProps) => {
  return (
    <div className="flex flex-col">
      <Header
        label="Explore"
        showBackButton
        border
        hasSearchInput
        autoFocusSearchInput
        currentUser={currentUser}
        className="py-1.5"
      />
    </div>
  );
};
