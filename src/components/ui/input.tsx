import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  limit?: number;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, limit, className, type, ...props }, ref) => {
    const value = String(props.value);
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            label &&
              "border-0 h-16 ring-[1px] focus:ring-[2px] ring-input focus:ring-primary p-2 peer",
            limit && "",
            limit && value.length > limit && "ring-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <p
            className={cn(
              "absolute top-1/2 -translate-y-1/2 left-2 text-sm peer-focus:top-3 peer-focus:text-xs text-muted-foreground peer-focus:text-primary transition-all",
              value && "top-3 text-xs",
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
              "absolute peer-focus:text-primary bottom-0.5 text-sm right-1",
              value.length > limit && "text-red-500 peer-focus:text-red-500"
            )}
          >{`${value.length}/${limit}`}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
