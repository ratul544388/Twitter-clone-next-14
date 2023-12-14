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

interface CommunityRejectButtonProps {
  communityId: string;
  userId: string;
  queryKey: string;
}

export const CommunityRejectButton = ({
  communityId,
  userId,
  queryKey,
}: CommunityRejectButtonProps) => {
  const QueryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/communities/${communityId}/requests/reject`, {
        userId,
      });
    },
    onSuccess: () => {
      toast.success("Rejected");
      QueryClient.invalidateQueries([queryKey] as InvalidateQueryFilters);
      router.refresh();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  return (
    <Button variant="destructive" disabled={isPending} onClick={() => mutate()}>
      Reject
    </Button>
  );
};
