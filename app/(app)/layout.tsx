import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { requireCurrentBusiness } from "@/lib/auth/session";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { business, session } = await requireCurrentBusiness();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
      <aside className="hidden w-full max-w-[280px] shrink-0 lg:block">
        <div className="sticky top-4">
          <AppSidebar businessName={business.name} category={business.category} />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <header className="rounded-2xl border border-white/70 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Workspace dashboard</div>
              <div className="text-sm text-muted-foreground">Signed in as {session.user.email}</div>
            </div>
            <div className="text-sm text-muted-foreground">
              Data remains isolated to <span className="font-semibold text-foreground">{business.name}</span>
            </div>
          </div>
        </header>
        <main className="space-y-6">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}
