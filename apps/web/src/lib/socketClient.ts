import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? process.env.SOCKET_URL ?? "http://localhost:4000";

export function createLobbySocket(): Socket {
  return io(`${SOCKET_URL}/lobby`, { transports: ["websocket"] });
}

export function createRoomSocket(roomId: string): Socket {
  return io(`${SOCKET_URL}/room:${roomId}`, { transports: ["websocket"] });
}
