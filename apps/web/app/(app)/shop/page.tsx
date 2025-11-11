"use client";

import { useSession } from "next-auth/react";
import { Card, Button } from "@sandbox/ui";
import type { ShopItem } from "@sandbox/game-core";

const items: ShopItem[] = [
  { id: "skin-neon", name: "Neon Runner", cost: 120, emoji: "🟩" },
  { id: "skin-astro", name: "Astro Suit", cost: 200, emoji: "🪐" },
  { id: "skin-zen", name: "Zen Monk", cost: 90, emoji: "🧘" }
];

export default function ShopPage() {
  const { data } = useSession();
  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cosmetic Shop</h1>
          <p className="text-sm text-slate-500">Earn coins in games to unlock new skins.</p>
        </div>
        <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          Coins: {data?.user?.coins ?? 0}
        </span>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} title={`${item.emoji} ${item.name}`} className="bg-white/90">
            <p className="text-sm text-slate-600">Cost: {item.cost} coins</p>
            <Button variant="outline" disabled>
              Coming soon
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
