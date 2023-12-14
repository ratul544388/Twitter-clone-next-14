"use client";

import { Button } from "@/components/ui/button";
import { FullCommunityType } from "@/types";
import { Community, User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface JoinCommunityButtonProps {
  community: Community;
}

export const JoinCommunityButton = ({ community }: JoinCommunityButtonProps) => {
  const router = useRouter();

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
      router.refresh();
    },
  });

  return (
    <>
      <Button
        disabled={isPending}
        onClick={() => mutate()}
        variant="outline"
        className="text-black"
      >
        Join
      </Button>
    </>
  );
};
