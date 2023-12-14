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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function DeleteCommunityModal() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const { community } = data;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/communities/${community?.id}`);
    },
    onSuccess: () => {
      router.refresh();
      toast.success("Community was deleted");
      router.push("/communities");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <Dialog
      open={isOpen && type === "deleteCommunityModal"}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete the community?
          </DialogTitle>
          <DialogDescription>This Action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex mt-4 xs:flex-row flex-col gap-3 xs:ml-auto">
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
