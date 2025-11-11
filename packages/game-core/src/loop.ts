import type { GameLoopHandle, GameLoopOptions } from "./types";

export function createGameLoop({ tickRate, now }: GameLoopOptions): GameLoopHandle {
  const listeners = new Set<(dt: number) => void>();
  const interval = 1000 / tickRate;
  let timer: NodeJS.Timeout | null = null;
  let last = now();

  function tick() {
    const current = now();
    const dt = (current - last) / 1000;
    last = current;
    listeners.forEach((listener) => listener(dt));
  }

  return {
    start() {
      if (timer) return;
      last = now();
      timer = setInterval(tick, interval);
    },
    stop() {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
