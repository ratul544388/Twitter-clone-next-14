"use client";

import { Button } from "@/components/ui/button";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface CommunityApproveButtonProps {
  communityId: string;
  userId: string;
  queryKey: string;
}

export const CommunityApproveButton = ({
  communityId,
  userId,
  queryKey,
}: CommunityApproveButtonProps) => {
  const QueryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/communities/${communityId}/requests/approve`, {
        userId,
      });
    },
    onSuccess: () => {
      toast.success("Approved");
      QueryClient.invalidateQueries([queryKey] as InvalidateQueryFilters);
      router.refresh();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  return (
    <Button disabled={isPending} onClick={() => mutate()}>
      Approve
    </Button>
  );
};
