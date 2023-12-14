"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Community } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CancelCommunityRequestButtonProps {
  community: Community;
}

export const CancelCommunityRequestButton = ({
  community,
}: CancelCommunityRequestButtonProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/communities/${community.id}/cancel-request`);
    },
    onSuccess: () => {
      toast.success("You request has been canceled");
      router.refresh();
    },
    onError: () => {
      toast.error("Something went wrong");
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
        Requested
      </Button>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Are you sure you want to cancel the request?"
        description="This action cannot be undone. You can later send joining request again."
        disabled={isPending}
        onConfirm={() => mutate()}
      />
    </>
  );
};
