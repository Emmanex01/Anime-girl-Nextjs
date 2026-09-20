"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { User, ChevronDown, UserCircle, MapPin, Package, LogOut } from "lucide-react";
import { shopifyCustomer } from "@/lib/shopify/types";


interface AccountMenuProps {
  currentCustomer: shopifyCustomer | null;
}

export default function AccountMenu({
  currentCustomer,
}: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  

  // Close on outside click (covers keyboard users tabbing away, and mobile taps)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  const links = [
    { href: "/account/profile", label: "Profile", icon: UserCircle },
    { href: "/account/addresses", label: "Addresses", icon: MapPin },
    { href: "/account/orders", label: "Orders", icon: Package },
  ];

  return (
    <div
      ref={containerRef}
      className="relative md:block"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex items-center gap-2 cursor-pointer group hover:text-neon-blue transition-colors bg-transparent border-none outline-none font-bold ${
         "text-white/60"
        }`}
      >
        <User
          className={`w-4 h-4 ${
            currentCustomer ? "text-neon-blue animate-pulse" : "text-white/40"
          }`}
        />
        <span className="text-[10px] font-bold tracking-widest uppercase">
          {currentCustomer ? currentCustomer.firstName : "My Account"}
        </span>
        {currentCustomer && (
          <ChevronDown
            className={`w-3 h-3 text-white/40 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full pt-3 w-48 z-50"
        >
          <div className="rounded-md border border-white/10 bg-black/95 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden">
            {currentCustomer ? (
              <>
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-xs font-bold text-white/80 truncate">
                    {currentCustomer.firstName} {currentCustomer.lastName}
                  </p>
                  {currentCustomer.emailAddress && (
                    <p className="text-[10px] text-white/40 truncate mt-0.5">
                      {currentCustomer.emailAddress.emailAddress}
                    </p>
                  )}
                </div>

                <nav className="py-1">
                  {links.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-bold tracking-wide uppercase text-white/60 hover:text-neon-blue hover:bg-white/5 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </Link>
                  ))}
                </nav>

                <div className="border-t border-white/10 py-1">
                  <button
                    role="menuitem"
                    onClick={() => {
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-bold tracking-wide uppercase text-white/60 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-none outline-none"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <nav className="py-1">
                <Link
                  href="/auth/login"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-[11px] font-bold tracking-wide uppercase text-white/60 hover:text-neon-blue hover:bg-white/5 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/login"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-[11px] font-bold tracking-wide uppercase text-white/60 hover:text-neon-blue hover:bg-white/5 transition-colors"
                >
                  Sign up
                </Link>
              </nav>
            )}
          </div>
        </div>
      )}
    </div>
  );
}