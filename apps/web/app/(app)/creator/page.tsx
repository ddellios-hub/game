"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Card } from "@sandbox/ui";
import { api } from "@/lib/api";

const palette = [
  { id: "block", color: "bg-slate-400" },
  { id: "lava", color: "bg-red-400" },
  { id: "coin", color: "bg-yellow-300" }
];

export default function CreatorPage() {
  const { data } = useSession();
  const [selected, setSelected] = useState(palette[0]);
  const [cells, setCells] = useState<(string | null)[]>(Array(25).fill(null));
  const [status, setStatus] = useState<string | null>(null);

  function handleCellClick(index: number) {
    setCells((prev) => {
      const next = [...prev];
      next[index] = selected.id;
      return next;
    });
  }

  async function handleSave() {
    const layout = cells
      .map((cell, index) => ({
        type: cell,
        position: [index % 5, Math.floor(index / 5)]
      }))
      .filter((item) => item.type);
    if (!data?.user?.id) {
      setStatus("Sign in to save worlds.");
      return;
    }
    try {
      await api.post("/api/worlds", {
        name: `Creator Build ${Date.now()}`,
        ownerId: data.user.id,
        json: { layout },
        type: "OBBY"
      });
      setStatus("World saved!");
    } catch (error) {
      console.error(error);
      setStatus("Failed to save world");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">World Creator</h1>
        <Button onClick={handleSave}>Save world</Button>
      </header>
      {status && <p className="text-sm text-success">{status}</p>}
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card title="Palette" className="bg-white/90">
          <div className="flex gap-3">
            {palette.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`h-12 w-12 rounded-md border-2 ${selected.id === item.id ? "border-primary" : "border-transparent"} ${item.color}`}
                onClick={() => setSelected(item)}
                aria-label={item.id}
              />
            ))}
          </div>
        </Card>
        <Card title="Canvas" className="bg-white/90">
          <div className="grid grid-cols-5 gap-2">
            {cells.map((cell, index) => (
              <button
                key={index}
                type="button"
                className={`h-16 rounded-md border border-dashed border-slate-300 transition ${
                  cell ? palette.find((item) => item.id === cell)?.color : "hover:border-primary"
                }`}
                onClick={() => handleCellClick(index)}
                aria-label={`Cell ${index + 1}`}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
