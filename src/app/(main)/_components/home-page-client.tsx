"use client";

import TweetInput from "@/components/tweet-input";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FullUserType, InitialTweetsType, QueryType } from "@/types";
import Link from "next/link";
import { useState } from "react";
import { Feed } from "./feed";
import Header from "./header";
import { UserList } from "./user-list";

interface HomePageClientProps {
  currentUser: FullUserType;
  hasPeopleToFollow?: boolean;
}

const HomePageClient: React.FC<HomePageClientProps> = ({
  currentUser,
  hasPeopleToFollow,
}) => {
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
      {active === "FOR YOU" && <TweetInput currentUser={currentUser} />}
      {active === "FOLLOWING" && hasPeopleToFollow && (
        <div className="lg:hidden">
          <UserList type="WHO_TO_FOLLOW" take={4} hasFollowButton loadOnces />
          <Link
            href={`/${currentUser.username}/who-to-follow`}
            className={buttonVariants({
              variant: "link",
            })}
          >
            See more...
          </Link>
        </div>
      )}
      <Separator />
      <Feed
        currentUser={currentUser}
        type={active}
      />
    </div>
  );
};

export default HomePageClient;
