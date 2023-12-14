"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  className?: string;
  children?: ReactNode;
}

export const EmptyState = ({
  title = "No result found",
  className,
  children,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "mx-auto flex flex-col gap-3 p-5 text-muted-foreground",
        className
      )}
    >
      <p className="text-center">{title}</p>
      {children}
    </div>
  );
};
