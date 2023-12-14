import getCurrentUser from "@/actions/get-current-user";
import { FollowButton } from "@/components/follow-button";
import FollowersInfo from "@/components/followers-info";
import { CoverPhoto } from "@/components/media/cover-photo";
import { ProfilePhoto } from "@/components/media/profile-photo";
import { Button } from "@/components/ui/button";
import db from "@/lib/db";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import Header from "../../../_components/header";
import ProfileTweets from "../_components/profile-tweets";

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

  return (
    <main className="flex flex-col w-full">
      <Header label={user.username} border showBackButton />
      <CoverPhoto value={user.coverPhoto} />
      <div className="relative">
        <ProfilePhoto
          value={user.image}
          className="absolute -translate-y-1/2 left-3"
        />
      </div>
      <div className="p-3 ml-auto">
        {user.id === currentUser.id ? (
          <Button>Edit profile</Button>
        ) : (
          <FollowButton
            user={user}
            currentUser={currentUser}
            queryKey="whoToFollow"
          />
        )}
      </div>
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
