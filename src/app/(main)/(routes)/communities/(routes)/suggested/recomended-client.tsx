"use client";

import Header from "@/app/(main)/_components/header";
import { CommunityList } from "@/app/(main)/(routes)/communities/_components/community-list";
import { SearchInput } from "@/components/search-input";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RecomendedClientProps {
  currentUser: User;
}

export const RecomendedClient = ({ currentUser }: RecomendedClientProps) => {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const onChange = (value: string) => {
    setInputValue(value);
    router.push(`/communities/suggested/?q=${value}`);
  };

  return (
    <div className="flex flex-col">
      <Header showBackButton border>
        <SearchInput
          value={inputValue}
          onChange={(value) => onChange(value)}
          placeholder="Search communities..."
          className="mr-2"
        />
      </Header>
      <h1 className="p-3 pb-2 text-xl font-bold">Suggested for you</h1>
      <CommunityList />
    </div>
  );
};
