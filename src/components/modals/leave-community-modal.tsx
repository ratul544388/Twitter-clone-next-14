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

  const { community } = data;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/communities/${community?.id}/leave`);
    },
    onSuccess: () => {
      toast.success(`You leaved the community`);
      router.refresh();
    },
  });

  return (
    <Dialog
      open={isOpen && type === "leaveCommunityModal"}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to leave the community?
          </DialogTitle>
          <DialogDescription>
            This Action cannot be undone. You can join or request to join
            community again.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex mt-5 xs:flex-row flex-col gap-3 xs:ml-auto">
          <Button
            variant="outline"
            className="xs:w-fit w-full"
            disabled={isPending}
            onClick={onClose}
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
