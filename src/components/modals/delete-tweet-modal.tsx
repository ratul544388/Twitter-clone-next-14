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

export function DeleteTweetModal() {
  const { isOpen, onClose, type, data } = useModal();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { tweet, queryKey } = data;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/tweets/${tweet?.id}`);
    },
    onSuccess: () => {
      toast.success("Tweet was deleted");
      if (queryKey) {
        queryClient.invalidateQueries([queryKey] as InvalidateQueryFilters);
      } else {
        router.refresh();
        router.push("/");
      }
      onClose();
    },
  });

  return (
    <Dialog open={isOpen && type === "deleteTweetModal"} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete the tweet?</DialogTitle>
          <DialogDescription>This Action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex mt-5 xs:flex-row flex-col gap-3 xs:ml-auto">
          <Button
            variant="outline"
            onClick={onClose}
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
