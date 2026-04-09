import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquareText, PhoneForwarded, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: MessageSquareText,
    title: "Answer FAQs instantly",
    description:
      "Give customers clear answers on services, pricing notes, opening hours, and locations without manual back-and-forth.",
  },
  {
    icon: PhoneForwarded,
    title: "Capture leads and bookings",
    description:
      "Turn inbound WhatsApp messages into structured leads and booking requests your team can follow up on fast.",
  },
  {
    icon: Store,
    title: "Business-aware automation",
    description:
      "Each workspace gets its own bot settings, FAQs, tone of voice, and WhatsApp configuration.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-10">
      <header className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3 backdrop-blur">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            WhatsApp AI Receptionist
          </div>
          <div className="text-sm text-muted-foreground">
            For clinics, salons, repair shops, and local service businesses
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Sign in
          </Link>
          <Button asChild>
            <Link href="/sign-up">Start free</Link>
          </Button>
        </div>
      </header>

      <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-sm text-primary shadow-sm backdrop-blur">
            Production-minded MVP for automating WhatsApp front desks
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Turn every WhatsApp message into a faster answer, a captured lead, or a booking request.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Give small businesses a clean dashboard to manage conversations, FAQs, leads, bookings, and
              business-specific AI replies without leaking tenant data or relying on fragile demo logic.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link href="/sign-up">
                Create your workspace
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              Tenant-isolated data model
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              WhatsApp webhook automation
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              OpenAI-backed short replies
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              Lead and booking capture workflow
            </div>
          </div>
        </div>

        <Card className="overflow-hidden border-primary/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(236,247,246,0.92))]">
          <CardHeader className="border-b border-border/70">
            <CardTitle className="text-2xl">What the MVP includes</CardTitle>
            <CardDescription>
              A focused SaaS workflow small businesses can actually operate from day one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-border/80 bg-white/80 p-4 shadow-xs">
                <div className="mb-3 inline-flex rounded-xl bg-secondary p-3 text-primary">
                  <feature.icon className="size-5" />
                </div>
                <h2 className="text-base font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
