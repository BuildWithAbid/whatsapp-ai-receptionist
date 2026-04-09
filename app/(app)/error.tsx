"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppError({
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
    <Card className="bg-white/95">
      <CardHeader>
        <CardTitle>We could not load this view</CardTitle>
        <CardDescription>Try again. If the problem persists, check environment configuration and database state.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={reset} type="button">
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}
