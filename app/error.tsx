"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center px-6 py-16">
        <Card className="w-full max-w-lg bg-white/95">
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
            <CardDescription>
              The application hit an unexpected error. Try again or return to the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={reset} type="button">
              Retry
            </Button>
            <Button asChild type="button" variant="outline">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </body>
    </html>
  );
}
