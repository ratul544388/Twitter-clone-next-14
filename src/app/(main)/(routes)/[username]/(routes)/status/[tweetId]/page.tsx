import getCurrentUser from "@/actions/get-current-user";
import Header from "@/app/(main)/_components/header";
import { Post } from "@/app/(main)/_components/post";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import ReplyInput from "./_components/reply-input";
import Replies from "./_components/replies";

const Page = async ({ params }: { params: { tweetId: string } }) => {
  const currentUser = await getCurrentUser();

  const tweet = await db.tweet.findUnique({
    where: {
      id: params.tweetId,
    },
    include: {
      user: {
        include: {
          followers: true,
        },
      },
      community: true,
      likes: true,
      retweets: true,
      tweet: {
        include: {
          user: {
            include: {
              followers: true,
            },
          },
          likes: true,
          retweets: true,
        },
      },
    },
  });

  if (!tweet) {
    redirect("/");
  }

  return (
    <div className="flex flex-col">
      <Header label="Tweet" showBackButton border />
      <Post currentUser={currentUser} tweet={tweet} />
      <ReplyInput tweet={tweet} currentUser={currentUser} />
      <Replies tweet={tweet} currentUser={currentUser} />
    </div>
  );
};

export default Page;
