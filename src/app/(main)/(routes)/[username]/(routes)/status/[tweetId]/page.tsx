import getCurrentUser from "@/actions/get-current-user";
import Header from "@/app/(main)/_components/header";
import { Post } from "@/app/(main)/_components/post";
import db from "@/lib/db";
import { redirect } from "next/navigation";

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
      <Post currentUser={currentUser} tweet={tweet} />
    </div>
  );
};

export default Page;
