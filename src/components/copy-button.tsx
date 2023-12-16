"use client";
import { cn } from "@/lib/utils";
import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface CopyButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(text);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
    toast.success(`${text} copied to clipboard`);
  };

  return (
    <div onClick={handleCopy} className="relative h-4 w-4">
      <Copy
        className={cn("h-4 w-4 text-muted-foreground", isCopied && "hidden")}
      />
      <CopyCheck
        className={cn(
          "h-4 w-4 pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 scale-95 transition-all duration-300",
          isCopied && "opacity-100 scale-105"
        )}
      />
    </div>
  );
};

export default CopyButton;
