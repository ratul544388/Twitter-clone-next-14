"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

interface AlartModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
  variant?: "destructive" | "default";
  disabled?: boolean;
}

export const AlertModal = ({
  isOpen,
  title,
  description,
  onConfirm,
  onClose,
  variant = "destructive",
  disabled,
}: AlartModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-4 flex-col xs:flex-row xs:ml-auto">
          <Button
            className="w-full xs:w-fit"
            onClick={onClose}
            disabled={disabled}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="w-full xs:w-fit"
            disabled={disabled}
            variant={variant}
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
