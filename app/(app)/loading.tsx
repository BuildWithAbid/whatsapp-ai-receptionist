import { Card, CardContent } from "@/components/ui/card";

export default function AppLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-40 animate-pulse rounded-xl bg-muted" />
        <div className="h-4 w-80 animate-pulse rounded-xl bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-4 p-6">
              <div className="h-4 w-24 animate-pulse rounded-xl bg-muted" />
              <div className="h-8 w-16 animate-pulse rounded-xl bg-muted" />
              <div className="h-4 w-28 animate-pulse rounded-xl bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
