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
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function LeaveCommunityModal() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const { communityId } = data;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/communities/${communityId}/leave`);
    },
    onSuccess: () => {
      onClose();
      toast.success(`You leaved the community`);
      router.refresh();
    },
  });

  return (
    <Dialog
      open={isOpen && type === "leaveCommunityModal"}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-[300px] pb-3">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>Leave the community?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            className="w-full"
            disabled={isPending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-full"
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
