"use client";

import { SearchInput } from "@/components/search-input";
import { FullUserType } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "../../_components/header";

interface SearchClientProps {
  q: string;
  currentUser: FullUserType;
}

export const ExploreClient = ({ q, currentUser }: SearchClientProps) => {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <Header
        label="Explore"
        showBackButton
        border
        currentUser={currentUser}
        className="py-1.5"
      >
        <SearchInput
          value={inputValue}
          onChange={(value) => setInputValue(value)}
          onSubmit={() => router.push(`/explore/search/?q=${inputValue}`)}
          results
        />
      </Header>
      <h1 className="font-semibold p-3 text-muted-foreground text-center">
        Discover the latest on Twitter – explore trending topics, connect with
        people, and stay informed in real-time. Dive into the conversation. 🚀
        #ExploreNow
      </h1>
    </div>
  );
};
