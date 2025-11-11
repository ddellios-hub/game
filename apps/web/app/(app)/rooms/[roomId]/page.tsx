"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card } from "@sandbox/ui";
import { ObbyCanvas } from "@/components/games/ObbyCanvas";
import { PlatformerCanvas } from "@/components/games/PlatformerCanvas";
import { RoomChat } from "@/components/chat/RoomChat";
import { ReportUserDialog } from "@/components/ReportUserDialog";
import { api } from "@/lib/api";

interface WorldResponse {
  id: string;
  type: "OBBY" | "PLATFORMER";
  name: string;
}

export default function RoomPage() {
  const params = useParams<{ roomId: string }>();
  const { data: session } = useSession();
  const [world, setWorld] = useState<WorldResponse | null>(null);
  const [coinsCollected, setCoinsCollected] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/api/rooms/${params.roomId}`);
        setWorld(res.data.world ?? null);
      } catch (error) {
        console.error(error);
        setWorld(null);
      }
    }
    load();
  }, [params.roomId]);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <Card title={world?.name ?? "Room"} className="bg-white/80">
          <p className="text-sm text-slate-600">
            {world?.type === "PLATFORMER"
              ? `Collect coins to climb the leaderboard. Coins collected: ${coinsCollected}`
              : "Reach the final platform as fast as you can."}
          </p>
        </Card>
        {world?.type === "PLATFORMER" ? (
          <PlatformerCanvas coins={6} onCollect={(coins) => setCoinsCollected(coins)} />
        ) : (
          <ObbyCanvas />
        )}
        <ReportUserDialog reporterId={session?.user?.id ?? ""} targetUserId="demo-opponent" />
      </div>
      <RoomChat roomId={params.roomId} userId={session?.user?.id ?? "guest"} userName={session?.user?.name ?? "Player"} />
    </div>
  );
}
