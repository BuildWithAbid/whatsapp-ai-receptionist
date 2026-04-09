import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCount } from "@/lib/utils";

export function StatCard({
  description,
  icon: Icon,
  title,
  value,
}: {
  title: string;
  description: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <Card className="bg-white/90">
      <CardContent className="flex items-start justify-between p-6">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          <div className="text-3xl font-semibold tracking-tight">{formatCount(value)}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
        <div className="rounded-2xl bg-secondary p-3 text-primary">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
