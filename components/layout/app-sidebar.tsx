"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Building2, CalendarRange, LayoutDashboard, MessageSquare, Settings2, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { SignOutButton } from "@/components/layout/sign-out-button";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/bookings", label: "Bookings", icon: CalendarRange },
  { href: "/settings/business", label: "Settings", icon: Settings2 },
  { href: "/settings/faq", label: "FAQs", icon: BookOpen },
];

export function AppSidebar({
  businessName,
  category,
}: {
  businessName: string;
  category: string;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-4">
      <Card className="bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(236,247,246,0.92))]">
        <CardContent className="space-y-3 p-5">
          <div className="inline-flex rounded-2xl bg-secondary p-3 text-primary">
            <Building2 className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Workspace</p>
            <h2 className="mt-1 text-lg font-semibold">{businessName}</h2>
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/85">
        <CardContent className="p-3">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 border-t border-border/70 pt-3">
            <SignOutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
