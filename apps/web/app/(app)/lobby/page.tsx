"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Card } from "@sandbox/ui";
import { useLobbyStore } from "@/stores/useLobbyStore";
import { createLobbySocket } from "@/lib/socketClient";
import { api } from "@/lib/api";
import Link from "next/link";

export default function LobbyPage() {
  const { data } = useSession();
  const rooms = useLobbyStore((state) => state.rooms);
  const setSnapshot = useLobbyStore((state) => state.setSnapshot);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = createLobbySocket();
    socket.on("lobby_snapshot", (snapshot) => setSnapshot({ rooms: snapshot, onlineUsers: [] }));
    return () => {
      socket.disconnect();
    };
  }, [setSnapshot]);

  async function handleCreateRoom() {
    try {
      setCreating(true);
      const name = `Room ${Math.floor(Math.random() * 1000)}`;
      await api.post("/api/rooms", {
        name,
        maxPlayers: 12,
        ownerId: data?.user?.id
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCreating(false);
    }
  }

  async function handleQuickPlay() {
    try {
      const res = await api.post("/api/rooms/quick-play", {});
      if (res.data?.id) {
        window.location.href = `/rooms/${res.data.id}`;
      }
    } catch (err) {
      setError("No rooms available yet");
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Lobby</h1>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleCreateRoom} disabled={creating}>
            {creating ? "Creating..." : "Create room"}
          </Button>
          <Button variant="outline" onClick={handleQuickPlay}>
            Quick Play
          </Button>
        </div>
      </header>
      {error && <p className="rounded-md border border-danger/50 bg-danger/10 p-3 text-sm text-danger">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rooms.map((room) => (
          <Card
            key={room.id}
            title={room.name}
            actions={<span className="text-xs uppercase text-slate-500">{room.status}</span>}
            className="bg-white/90"
          >
            <p className="text-sm text-slate-600">
              Players: <strong>{room.players}</strong> / {room.maxPlayers}
            </p>
            <Button asChild variant="outline">
              <Link href={`/rooms/${room.id}`}>Join</Link>
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
