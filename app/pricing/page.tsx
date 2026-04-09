import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const included = [
  "Unlimited tenant-scoped business settings",
  "WhatsApp webhook processing",
  "OpenAI-powered WhatsApp replies",
  "Lead and booking request capture",
  "Dashboard for conversations and follow-up",
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Simple pricing for local businesses</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          The MVP is designed for fast deployment and operational clarity rather than a bloated feature matrix.
        </p>
      </div>
      <Card className="mx-auto mt-10 max-w-2xl bg-white/92">
        <CardHeader>
          <CardTitle>Starter workspace</CardTitle>
          <CardDescription>One owner account, one WhatsApp line, AI-assisted conversations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="text-5xl font-semibold">$99</div>
            <div className="text-sm text-muted-foreground">per workspace / month, plus platform usage costs</div>
          </div>
          <div className="space-y-3">
            {included.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm">
                <div className="rounded-full bg-secondary p-1 text-primary">
                  <Check className="size-3" />
                </div>
                {item}
              </div>
            ))}
          </div>
          <Button asChild size="lg" className="w-full">
            <Link href="/sign-up">Create your workspace</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
