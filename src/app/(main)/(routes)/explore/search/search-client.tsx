"use client";

import { Feed } from "@/app/(main)/_components/feed";
import Header from "@/app/(main)/_components/header";
import { UserList } from "@/app/(main)/_components/user-list";
import { SearchInput } from "@/components/search-input";
import { FullUserType, QueryType } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchClientProps {
  currentUser: FullUserType;
}

export const SearchClient = ({ currentUser }: SearchClientProps) => {
  const navigations: QueryType[] = ["TWEETS", "PEOPLE", "MEDIA"];
  const [active, setActive] = useState<QueryType>("TWEETS");

  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <Header
        navigations={navigations}
        showBackButton
        active={active}
        onChange={(value) => setActive(value)}
        border
        currentUser={currentUser}
        className="pt-1.5"
      >
        <SearchInput
          value={inputValue}
          onChange={(value) => setInputValue(value)}
          onSubmit={() => router.push(`/explore/search/?q=${inputValue}`)}
          results
        />
      </Header>
      {active === "PEOPLE" ? (
        <UserList
          currentUser={currentUser}
          type={active}
          hasBio
          hasFollowButton
          searchQuery
        />
      ) : (
        <Feed
          currentUser={currentUser}
          type={active}
          media={active === "MEDIA"}
          searchQuery
        />
      )}
    </div>
  );
};
