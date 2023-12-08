"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import Icon from "../icon";
import { Button } from "../ui/button";
import { MediaUpload } from "../media/media-upload";
import { EmojiPicker } from "../emoji-picker";

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  actionLabel?: string;
  action?: () => void;
  className?: string;
  disabled?: boolean;
  imageUpload?: (value: string[]) => void;
  emojiPick?: (value: string) => void;

  limit?: number;
  onLimitChange?: (limit: number) => void;
}

export const Modal: React.FC<TestModalProps> = ({
  isOpen,
  onClose,
  children,
  actionLabel,
  action,
  className,
  disabled,
  imageUpload,
  emojiPick,
  limit,
  onLimitChange,
}) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      onClose();
    }, 150);
  };

  return (
    <div
      onClick={handleClose}
      className={cn(
        "fixed z-50 inset-0 bg-background/80 backdrop-blur-sm opacity-0 pointer-events-none",
        isOpen && "opacity-100 pointer-events-auto",
        className
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-[500px] rounded-xl bg-background border absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all opacity-20",
          open && "opacity-100"
        )}
      >
        <div className="sticky h-[50px] bg-background/80">
          <Icon icon={X} className="absolute left-1 top-1/2 -translate-y-1/2" />
        </div>
        <div className={cn("px-6", className)}>{children}</div>
        {action && (
          <div className="sticky bg-background py-2 px-3 border-t flex items-center">
            {imageUpload && emojiPick && (
              <div className="flex">
                <MediaUpload
                  onChange={(value) => value && imageUpload(value as string[])}
                  endPoint="multiMedia"
                  disabled={disabled}
                />
                <EmojiPicker
                  onChange={(value) => emojiPick(value)}
                  disabled={disabled}
                />
              </div>
            )}
            <Button disabled={disabled} className="ml-auto" onClick={action}>
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
