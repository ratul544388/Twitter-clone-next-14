"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { FullCommunityType } from "@/types";
import { Community, User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface CommunityJoiningButtonProps {
  community: FullCommunityType;
  currentUser: User;
}

export const CommunityJoiningButton = ({
  community,
  currentUser,
}: CommunityJoiningButtonProps) => {
  const router = useRouter();
  const { onOpen, onClose } = useModal();

  const isMember = community.members.some((member) => {
    return member.userId === currentUser.id;
  });

  const isRequested = community.requestedUserIds.some((id) => {
    return id === currentUser.id;
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/communities/${community.id}/join`);
    },
    onSuccess: () => {
      toast.success(
        community.type === "PRIVATE"
          ? "Your request is under review. Await approval for community access. Thank you!"
          : `You are now the member of "${community.name}" community`
      );
      onClose();
      router.refresh();
    },
  });

  const handleClick = () => {
    if (isMember) {
      return onOpen("leaveCommunityModal", { community });
    } else if (isRequested) {
      return onOpen("cancelCommunityRequestModal");
    } else {
      mutate();
    }
  };

  return (
    <>
      <Button
        disabled={isPending}
        onClick={handleClick}
        variant="outline"
        className="text-black"
      >
        {isMember ? "Joined" : isRequested ? "Requested" : "Join"}
      </Button>
    </>
  );
};
