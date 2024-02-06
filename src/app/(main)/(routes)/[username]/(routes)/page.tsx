import getCurrentUser from "@/actions/get-current-user";
import { FollowButton } from "@/components/follow-button";
import FollowersInfo from "@/components/followers-info";
import { CoverPhoto } from "@/components/media/cover-photo";
import { ProfilePhoto } from "@/components/media/profile-photo";
import db from "@/lib/db";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import Header from "../../../_components/header";
import { EditProfileButton } from "../_components/edit-profile-button";
import ProfileTweets from "../_components/profile-tweets";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { checkBlueBadgeSubscription } from "@/lib/blue-badge-subscription";
import { Feed } from "@/app/(main)/_components/feed";

const UsernamePage = async ({ params }: { params: { username: string } }) => {
  const user = await db.user.findUnique({
    where: {
      username: params.username,
    },
    include: {
      followers: true,
      followings: true,
      blueBadgeSubscription: true,
    },
  });

  const currentUser = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const tweetCount = await db.tweet
  .findMany({
    where: {
      isRetweet: false,
      isReply: false,
      isQuote: false,
      userId: user.id,
    },
  })
  .then((res) => res.length);

  return (
    <main className="flex flex-col w-full">
      <Header border showBackButton>
        <div className="flex flex-col">
          <h1 className="font-semibold text-lg">{user.username}</h1>
          <p className="text-sm">{tweetCount} tweets</p>
        </div>
      </Header>
      <CoverPhoto value={user.coverPhoto} />
      <div className="relative">
        <ProfilePhoto
          value={user.image}
          className="absolute -translate-y-1/2 left-3"
        />
      </div>
      <div className="p-3 ml-auto">
        {user.id === currentUser.id ? (
          <EditProfileButton currentUser={currentUser} user={user} />
        ) : (
          <FollowButton
            user={user}
            currentUser={currentUser}
            queryKey="whoToFollow"
          />
        )}
      </div>
      <div className="flex flex-col p-3 mt-3">
        <div className="flex items-center gap-1">
          <h1 className="font-bold text-lg ">{user.name}</h1>
          {checkBlueBadgeSubscription(user) && (
            <BiSolidBadgeCheck className="h-5 w-5 text-primary" />
          )}
        </div>
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
