import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export function KickCommunityModal() {
  const { isOpen, onClose, type, data } = useModal();
  const queryClient = useQueryClient();

  const { member, community, queryKey } = data;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await axios.post(
        `/api/communities/${community?.id}/members/${member?.id}/kick`
      );
    },
    onSuccess: () => {
      toast.success(
        `@${member?.user.username} has been kicked out from the community`
      );
      queryClient.invalidateQueries([queryKey] as InvalidateQueryFilters);
    },
  });

  return (
    <Dialog
      open={isOpen && type === "kickCommunityModal"}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to kick @{member?.user.username} from the
            community.
          </DialogTitle>
          <DialogDescription>
            This Action cannot be undone. Kicking out member form the community
            no longer be a part of the community.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex mt-5 xs:flex-row flex-col gap-3 xs:ml-auto">
          <Button
            variant="outline"
            className="xs:w-fit w-full"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="xs:w-fit w-full"
            disabled={isPending}
            onClick={() => mutate()}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
