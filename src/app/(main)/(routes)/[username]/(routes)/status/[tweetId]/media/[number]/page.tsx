import db from "@/lib/db";
import { notFound } from "next/navigation";
import React from "react";
import { MediaClient } from "./media-client";

const MediaPage = async ({
  params,
}: {
  params: { tweetId: string; number: string };
}) => {
  const tweet = await db.tweet.findUnique({
    where: {
      id: params.tweetId,
    },
    include: {
      user: true,
    },
  });

  const number = Number(params.number);

  if (!tweet || tweet.media.length < number) {
    notFound();
  }

  return <MediaClient tweet={tweet} number={number} />;
};

export default MediaPage;
