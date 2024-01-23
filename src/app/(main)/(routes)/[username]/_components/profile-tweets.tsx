"use client";

import { Feed } from "@/app/(main)/_components/feed";
import HeaderNavigations from "@/app/(main)/_components/header-navigations";
import { Post } from "@/app/(main)/_components/post";
import { LoadingError } from "@/components/loading-error";
import { FullTweetType, QueryType } from "@/types";
import { User } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
import { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface ProfileTweetsProps {
  currentUser: User;
  user: User;
}

const ProfileTweets: React.FC<ProfileTweetsProps> = ({ currentUser, user }) => {
  const navigations: QueryType[] = ["TWEETS", "REPLIES", "LIKES", "MEDIA"];
  const [active, setActive] = useState<QueryType>("TWEETS");

  return (
    <div className="mt-3">
      <HeaderNavigations
        navigations={navigations}
        border
        active={active}
        onChange={(value) => setActive(value)}
      />
      <Feed currentUser={currentUser} type={active} userId={user.id} />
    </div>
  );
};

export default ProfileTweets;
