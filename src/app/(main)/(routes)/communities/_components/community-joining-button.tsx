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

  const isAdmin = community.members.some((member) => {
    return member.userId === currentUser.id && member.role === "ADMIN";
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
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const handleClick = () => {
    if (isAdmin) {
      return onOpen("adminLeavingCommunityModal");
    } else if (isMember) {
      return onOpen("leaveCommunityModal", { communityId: community.id });
    } else if (isRequested) {
      return onOpen("cancelCommunityRequestModal", {
        communityId: community.id,
      });
    } else {
      mutate();
    }
  };

  return (
    <>
      <Button
        disabled={isPending}
        onClick={handleClick}
        variant="secondary"
        className="bg-slate-100 hover:bg-slate-100/90 text-zinc-800"
      >
        {isMember ? "Joined" : isRequested ? "Requested" : "Join"}
      </Button>
    </>
  );
};
