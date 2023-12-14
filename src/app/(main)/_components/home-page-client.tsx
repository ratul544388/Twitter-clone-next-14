"use client";

import TweetInput from "@/components/tweet-input";
import { FullUserType, QueryType } from "@/types";
import { useState } from "react";
import { Feed } from "./feed";
import Header from "./header";

interface HomePageClientProps {
  currentUser: FullUserType;
}

const HomePageClient: React.FC<HomePageClientProps> = ({ currentUser }) => {
  const navigations: QueryType[] = ["FOR YOU", "FOLLOWING"];
  const [active, setActive] = useState<QueryType>("FOR YOU");

  return (
    <div className="h-full">
      <Header
        label="Home"
        navigations={navigations}
        border
        active={active}
        onChange={(value) => setActive(value)}
        mobileSidebar
        currentUser={currentUser}
      />
      <TweetInput currentUser={currentUser} />
      <Feed currentUser={currentUser} type={active} />
    </div>
  );
};

export default HomePageClient;
