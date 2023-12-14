import getCurrentUser from "@/actions/get-current-user";
import Header from "@/app/(main)/_components/header";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import SinglePost from "./_components/single-post";
import ReplyInput from "./_components/reply-input";

const Page = async ({ params }: { params: { tweetId: string } }) => {
  const currentUser = await getCurrentUser();

  const tweet = await db.tweet.findUnique({
    where: {
      id: params.tweetId,
    },
    include: {
      user: true,
      likes: true,
      retweets: true,
      tweet: {
        include: {
          user: true,
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
      <SinglePost tweet={tweet} currentUser={currentUser} />
    </div>
  );
};

export default Page;
