"use client";
import FollowButton from "@/components/follow-button";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { FullUserType } from "@/types";
import { User } from "@prisma/client";

interface ProfilePageButtonProps {
  currentUser: User;
  user: FullUserType;
}

const ProfilePageButton: React.FC<ProfilePageButtonProps> = ({
  currentUser,
  user,
}) => {
  const { onOpen } = useModal();

  return (
    <div className="ml-auto p-3">
      {currentUser.id === user.id ? (
        <Button
          onClick={() => onOpen("editProfileModal", { user: currentUser })}
          variant="outline"
        >
          Edit profle
        </Button>
      ) : (
        <FollowButton
          user={user}
          currentUser={currentUser}
          queryKey="whoToFollow"
        />
      )}
    </div>
  );
};

export default ProfilePageButton;
