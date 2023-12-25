"use client";

import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="fixed inset-0 items-center justify-center flex">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
};
