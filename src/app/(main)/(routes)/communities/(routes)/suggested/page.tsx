"use client";

import Header from "@/app/(main)/_components/header";
import { SearchInput } from "@/components/search-input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CommunityList } from "../../_components/community-list";

const SuggestedPage = () => {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const onChange = (value: string) => {
    setInputValue(value);
    router.push(`/communities/suggested/?q=${value}`);
  };

  return (
    <div className="flex flex-col">
      <Header showBackButton border backButtonUrl="/communities">
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

export default SuggestedPage;
