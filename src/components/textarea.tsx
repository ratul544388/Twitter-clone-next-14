"use client";

import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
  placeholder?: string;
  label?: string;
  limit?: number;
}

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  disabled,
  className,
  autoFocus,
  placeholder,
  label,
  limit,
}) => {
  const { isOpen } = useModal();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && isOpen) {
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 500);
    }
  }, [autoFocus, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="relative text-sm">
      <textarea
        value={value}
        ref={inputRef}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "min-h-[50px] overflow-y-hidden pt-[7px] text-base rounded-lg h-auto w-full outline-none resize-none",
          disabled && "pointer-events-auto opacity-60",
          label &&
            "ring-[1px] focus:ring-[2px] ring-input focus:ring-primary p-2 pt-5 peer",
          limit && "pb-5",
          limit && value.length > limit && "ring-red-500 focus:ring-red-500",
          className
        )}
      />
      {label && (
        <p
          className={cn(
            "absolute top-4 left-2 text-sm text-muted-foreground peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary transition-all",
            value && "top-1 text-xs",
            limit &&
              value.length > limit &&
              "text-red-500 peer-focus:text-red-500"
          )}
        >
          {label}
        </p>
      )}
      {limit && (
        <p
          className={cn(
            "absolute peer-focus:text-primary bottom-1.5 right-1",
            value.length > limit && "text-red-500 peer-focus:text-red-500"
          )}
        >{`${value.length}/${limit}`}</p>
      )}
    </div>
  );
};

export default Textarea;
