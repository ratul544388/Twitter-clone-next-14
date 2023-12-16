"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { FullUserType } from "@/types";
import { User } from "@prisma/client";

interface EditProfileButtonProps {
  currentUser: User;
  user: FullUserType;
}

export const EditProfileButton: React.FC<EditProfileButtonProps> = ({
  currentUser,
  user,
}) => {
  const { onOpen } = useModal();

  return (
    <Button
      onClick={() => onOpen("editProfileModal", { user: currentUser })}
      variant="outline"
    >
      Edit profle
    </Button>
  );
};
