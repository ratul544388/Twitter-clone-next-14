"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Community } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface LeaveCommunityButtonProps {
  community: Community;
}

export const LeaveCommunityButton = ({
  community,
}: LeaveCommunityButtonProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/communities/${community.id}/leave`);
    },
    onSuccess: () => {
      toast.success("You leaved the community");
      router.refresh();
      setIsOpen(false);
    },
  });

  return (
    <>
      <Button
        disabled={isPending}
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="text-black"
      >
        Joined
      </Button>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Are you sure you want to Leave the community"
        description="This action cannot be undone. You can later join or send request to join the community again"
        disabled={isPending}
        onConfirm={() => mutate()}
      />
    </>
  );
};
