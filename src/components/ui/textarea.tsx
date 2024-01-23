import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  limit?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, limit, ...props }) => {
    const inputRef = React.useRef<HTMLTextAreaElement>(null);
    const value = props.value as string;

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      }
    }, [value]);

    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex w-full resize-none overflow-y-hidden rounded-md border-none bg-background px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            label &&
              "peer ring-[1px] focus:ring-[2px] ring-input focus:ring-primary pl-2 pt-5 text-sm",
            limit && "pb-5",
            className
          )}
          ref={inputRef}
          {...props}
        />
        {label && (
          <p
            className={cn(
              "absolute top-6 left-2 text-muted-foreground -translate-y-1/2 text-sm peer-focus:top-3 peer-focus:text-xs transition-all peer-focus:text-primary",
              value && "top-3 text-xs"
            )}
          >
            {label}
          </p>
        )}
        {limit && (
          <p
            className={cn(
              "absolute right-1 bottom-0 text-muted-foreground text-sm transition-all peer-focus:text-primary"
            )}
          >
            {`${value.length}/${limit}`}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
