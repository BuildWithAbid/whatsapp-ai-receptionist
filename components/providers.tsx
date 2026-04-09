"use client";

import { Toaster } from "sonner";

export function Providers() {
  return (
    <Toaster
      position="top-right"
      richColors
      toastOptions={{
        classNames: {
          toast: "border border-border bg-card text-card-foreground shadow-lg",
        },
      }}
    />
  );
}
