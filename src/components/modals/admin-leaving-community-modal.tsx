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

export function AdminLeavingCommunityModal() {
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
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <Dialog
      open={isOpen && type === "adminLeavingCommunityModal"}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-[300px] pb-3">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription className="text-red-500">
            Worning!!! You cannot leave the community since you are the admin of
            the community. To leave the community you have to make someone else
            admin first.
          </DialogDescription>
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
            disabled
            onClick={() => mutate()}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
