"use client";

import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="items-center justify-center flex h-full">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
};
