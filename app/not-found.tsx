import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6 py-16">
      <Card className="w-full bg-white/95">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="rounded-2xl bg-secondary p-4 text-primary">
            <SearchX className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The page you requested does not exist or may have moved.
            </p>
          </div>
          <Button asChild>
            <Link href="/">Return home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
