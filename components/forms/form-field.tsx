import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

export function FormField({
  children,
  description,
  error,
  htmlFor,
  label,
}: {
  label: string;
  htmlFor: string;
  description?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {description ? <p className="text-xs leading-5 text-muted-foreground">{description}</p> : null}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
