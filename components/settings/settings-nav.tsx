"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/settings/business", label: "Business" },
  { href: "/settings/bot", label: "Bot" },
  { href: "/settings/whatsapp", label: "WhatsApp" },
  { href: "/settings/faq", label: "FAQ" },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active ? "bg-primary text-primary-foreground" : "bg-white text-muted-foreground hover:bg-secondary",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
