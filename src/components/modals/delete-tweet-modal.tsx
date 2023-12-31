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
      queryClient.invalidateQueries([queryKey] as InvalidateQueryFilters);
      onClose();
    },
  });

  return (
    <Dialog open={isOpen && type === "deleteTweetModal"} onOpenChange={onClose}>
      <DialogContent className="max-w-[300px] pb-3">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>Delete the tweet permanently.</DialogDescription>
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
