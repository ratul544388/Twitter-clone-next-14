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
  useMutation
} from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function CancelCommunityRequestModal() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const { communityId } = data;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/communities/${communityId}/cancel-request`);
    },
    onSuccess: () => {
      toast.success("Request cancelled");
      router.refresh();
      onClose();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <Dialog
      open={isOpen && type === "cancelCommunityRequestModal"}
      onOpenChange={onClose}
    >
      <DialogContent className="pb-2 max-w-[300px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>Cancel the community request</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
            disabled={isPending}
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
