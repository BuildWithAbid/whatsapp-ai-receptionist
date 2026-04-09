"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarRange, LayoutDashboard, MessageSquare, Settings2, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/conversations", icon: MessageSquare, label: "Chats" },
  { href: "/leads", icon: Users, label: "Leads" },
  { href: "/bookings", icon: CalendarRange, label: "Bookings" },
  { href: "/settings/business", icon: Settings2, label: "Settings" },
  { href: "/settings/faq", icon: BookOpen, label: "FAQs" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="sticky bottom-4 z-20 mt-6 lg:hidden">
      <div className="grid grid-cols-6 gap-2 rounded-2xl border border-border/70 bg-white/95 p-2 shadow-lg backdrop-blur">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary",
              )}
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
