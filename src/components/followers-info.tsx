import { FullUserType } from "@/types";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface FollowersInfoProps {
  user: FullUserType;
}

const FollowersInfo: React.FC<FollowersInfoProps> = ({ user }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1 font-bold">
        {user.followings.length}
        <p className="text-muted-foreground font-normal">
          {user.followings.length > 1 ? "Followings" : "Following"}
        </p>
      </div>
      <div className="flex items-center gap-1 font-bold">
        {user.followers.length}
        <p className="text-muted-foreground font-normal">
          {user.followers.length > 1 ? "Followers" : "Follower"}
        </p>
      </div>
    </div>
  );
};

export default FollowersInfo;
