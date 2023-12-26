import getCurrentUser from "@/actions/get-current-user";
import { getTweet } from "@/actions/get-tweet";
import { redirect } from "next/navigation";
import { SingleTweet } from "./single-tweet";

const Page = async ({ params }: { params: { tweetId: string } }) => {
  const currentUser = await getCurrentUser();

  const tweet = await getTweet({ tweetId: params.tweetId });

  if (!tweet) {
    redirect("/");
  }

  return (
    <SingleTweet tweet={tweet} currentUser={currentUser} queryKey={tweet.id} />
  );
};

export default Page;
