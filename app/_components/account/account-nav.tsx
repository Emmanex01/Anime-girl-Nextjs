"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, UserCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account", label: "Overview", icon: LayoutGrid },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/profile", label: "Profile", icon: UserCircle },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <aside className="lg:sticky lg:top-8 lg:self-start">
      <nav aria-label="Account navigation" className="glass rounded-2xl border p-2 shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
        <ul className="space-y-1.5">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href === "/account" && pathname === "/account");

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-white/8 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                      active
                        ? "border-neon-red/40 bg-neon-red/10 text-neon-red"
                        : "border-white/10 bg-white/3 text-slate-400",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}