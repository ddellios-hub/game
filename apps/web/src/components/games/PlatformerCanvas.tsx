"use client";

import { useEffect, useRef } from "react";

interface PlatformerCanvasProps {
  coins: number;
  onCollect?: (coins: number) => void;
}

export function PlatformerCanvas({ coins, onCollect }: PlatformerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame: number;
    let collected = 0;

    const coinPositions = Array.from({ length: coins }, (_, i) => ({ x: 40 + i * 40, y: 80 })) as Array<{
      x: number;
      y: number;
      collected?: boolean;
    }>;

    function render(time: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#1f2937";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0ea5e9";
      ctx.fillRect(20 + ((time / 10) % (canvas.width - 40)), 120, 30, 10);

      ctx.fillStyle = "#facc15";
      coinPositions.forEach((coin, index) => {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 6, 0, Math.PI * 2);
        ctx.fill();
        if (coin.x < (time / 10) % canvas.width && !coin.collected) {
          coin.collected = true;
          collected += 1;
          onCollect?.(collected);
        }
      });

      frame = requestAnimationFrame(render);
    }
    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [coins, onCollect]);

  return <canvas ref={canvasRef} width={320} height={180} className="w-full rounded-2xl border border-slate-200 bg-slate-950" />;
}
