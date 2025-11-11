"use client";

import { create } from "zustand";
import type { LobbySnapshot, RoomSummary } from "@sandbox/game-core";

interface LobbyState {
  rooms: RoomSummary[];
  setSnapshot(snapshot: LobbySnapshot): void;
}

export const useLobbyStore = create<LobbyState>((set) => ({
  rooms: [],
  setSnapshot(snapshot) {
    set({ rooms: snapshot.rooms });
  }
}));
