import { FullUserType } from "@/types";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface FollowersInfoProps {
  user: FullUserType;
}

const FollowersInfo: React.FC<FollowersInfoProps> = ({ user }) => {
  return (
    <div className="flex items-center gap-4">
      <Link
        href={`/${user.username}/followers`}
        className="flex items-center hover:underline gap-1 font-bold"
      >
        {user.followings.length}
        <p className="text-muted-foreground font-normal">
          {user.followings.length > 1 ? "Followings" : "Following"}
        </p>
      </Link>
      <Link
        href={`/${user.username}/followings`}
        className="flex items-center gap-1 hover:underline font-bold"
      >
        {user.followers.length}
        <p className="text-muted-foreground font-normal">
          {user.followers.length > 1 ? "Followers" : "Follower"}
        </p>
      </Link>
    </div>
  );
};

export default FollowersInfo;
