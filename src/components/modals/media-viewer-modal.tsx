import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export function MediaViewerModal() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!isOpen) {
    return null;
  }

  const mediaQuery = Number(searchParams.get("media"));

  const { tweet } = data;
  const length = tweet?.media.length;

  if (!tweet) {
    return router.push("/");
  }

  const handleClose = () => {
    router.back();
  };

  return (
    <Dialog
      open={isOpen && type === "mediaViewerModal"}
      onOpenChange={handleClose}
    >
      <DialogContent className="max-w-full xs:max-w-[90vw] h-full">
        <Image
          src={tweet.media[mediaQuery]}
          alt="photo"
          fill
          className="object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
