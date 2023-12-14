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

export function MakingCommunityAdminModal() {
  const { isOpen, onClose, type, data } = useModal();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { member, community, queryKey } = data;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await axios.patch(
        `/api/communities/${community?.id}/members/${member?.id}/change-role`,
        {
          role: "ADMIN",
        }
      );
    },
    onSuccess: () => {
      toast.success(`${member?.user.username} is now Admin of the community`);
      queryClient.invalidateQueries([queryKey] as InvalidateQueryFilters);
      router.refresh();
      onClose();
    },
  });

  return (
    <Dialog
      open={isOpen && type === "makingCommunityAdminModal"}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to make @{member?.user.username} Admin?
          </DialogTitle>
          <DialogDescription>
            This Action cannot be undone. Making someone else Admin you will
            automatically become Moderator of the community.
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
