export type Role = "admin" | "moderator" | "player";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  coins: number;
  createdAt: Date;
}

export type RoomStatus = "waiting" | "in-progress" | "ended";

export interface RoomSummary {
  id: string;
  name: string;
  maxPlayers: number;
  status: RoomStatus;
  worldId: string | null;
  players: number;
}

export interface PresenceUser {
  id: string;
  name: string;
  avatar: string;
  role: Role;
}

export interface LobbySnapshot {
  rooms: RoomSummary[];
  onlineUsers: PresenceUser[];
}

export interface WorldDefinition {
  id: string;
  ownerId: string;
  name: string;
  json: Record<string, unknown>;
  isPublished: boolean;
  likes: number;
  type: "obby" | "platformer";
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  message: string;
  createdAt: string;
}

export interface ReportPayload {
  targetUserId: string;
  reason: string;
}

export interface GameEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
}

export interface Tickable {
  tick(delta: number): void;
}

export interface GameLoopOptions {
  tickRate: number;
  now: () => number;
}

export interface GameLoopHandle {
  start(): void;
  stop(): void;
  subscribe(listener: (dt: number) => void): () => void;
}

export interface PhysicsBody {
  id: string;
  position: [number, number, number];
  velocity: [number, number, number];
  size: [number, number, number];
  grounded: boolean;
}

export interface CollisionResult {
  collided: boolean;
  normal: [number, number, number];
}

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  emoji: string;
}

export type Locale = "en" | "el";

export interface TranslationDictionary {
  locale: Locale;
  strings: Record<string, string>;
}
