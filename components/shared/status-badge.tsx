import { Badge } from "@/components/ui/badge";

export function StatusBadge({
  status,
}: {
  status: "OPEN" | "NEEDS_HUMAN" | "CLOSED" | "NEW" | "CONTACTED" | "CONFIRMED";
}) {
  const variant =
    status === "CLOSED"
      ? "default"
      : status === "NEEDS_HUMAN"
        ? "warning"
        : status === "CONTACTED" || status === "CONFIRMED"
          ? "info"
          : "success";

  return <Badge variant={variant}>{status.replaceAll("_", " ")}</Badge>;
}
