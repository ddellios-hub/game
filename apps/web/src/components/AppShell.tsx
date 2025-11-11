"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@sandbox/ui";
import { signOut, useSession } from "next-auth/react";
import { getDictionary } from "@sandbox/game-core";

const links = [
  { href: "/lobby", label: "lobby" },
  { href: "/creator", label: "editor" },
  { href: "/shop", label: "shop" },
  { href: "/reports", label: "reports" },
  { href: "/admin", label: "moderation" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data } = useSession();
  const t = getDictionary("en");
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/lobby" className="text-xl font-bold text-primary">
            Sandbox Hub
          </Link>
          <nav className="flex items-center gap-4" aria-label="Main">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition hover:text-primary ${
                  pathname.startsWith(link.href) ? "text-primary" : "text-slate-500"
                }`}
              >
                {t[link.label] ?? link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:block" aria-live="polite">
              {data?.user?.name} · {data?.user?.coins ?? 0} coins
            </span>
            <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
              {t.logout}
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8">{children}</main>
    </div>
  );
}
