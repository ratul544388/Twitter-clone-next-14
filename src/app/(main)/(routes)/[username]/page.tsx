import db from "@/lib/db";
import Header from "../../_components/header";
import { redirect } from "next/navigation";
import CoverPhoto from "@/components/cover-photo";
import { Avatar } from "@/components/avatar";
import getCurrentUser from "@/actions/get-current-user";
import ProfilePageButton from "./_components/profile-page-button";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import FollowersInfo from "@/components/followers-info";
import ProfileTweets from "./_components/profile-tweets";
import { getFollowings } from "@/actions/get-followings";

const UsernamePage = async ({ params }: { params: { username: string } }) => {
  const user = await db.user.findUnique({
    where: {
      username: params.username,
    },
    include: {
      followers: true,
      followings: true,
    },
  });

  const tweetCount = await db.tweet
    .findMany({
      where: {
        isRetweet: false,
        isReply: false,
        isQuote: false,
      },
    })
    .then((res) => res.length);

  const currentUser = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const followings = await getFollowings(user.id);

  return (
    <main className="flex flex-col w-full">
      <Header
        label={user.username}
        border
        showBackButton
        tweetCount={tweetCount}
      />
      <CoverPhoto image={user.coverPhoto} />
      <div className="w-full relative">
        <Avatar
          image={user.image}
          classname="h-[130px] w-[130px] border-[4px] border-accent absolute -translate-y-1/2 left-3"
        />
      </div>
      <ProfilePageButton user={user} currentUser={currentUser} />
      <div className="flex flex-col p-3 mt-3">
        <h1 className="font-bold text-lg ">{user.name}</h1>
        <p className="text-muted-foreground">@{user.username}</p>
        <p className="text-muted-foreground mt-3">{user.bio}</p>
        <div className="text-muted-foreground flex items-center mt-1 mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          Joined {format(user.createdAt, "dd, MMM, yyyy")}
        </div>
        <FollowersInfo user={user} />
      </div>
      <ProfileTweets currentUser={currentUser} user={user} />
    </main>
  );
};

export default UsernamePage;
