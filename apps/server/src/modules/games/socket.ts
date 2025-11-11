import type { Namespace, Server, Socket } from "socket.io";
import { prisma } from "../../lib/prisma";
import { sanitizeMessage } from "@sandbox/game-core";
import { z } from "zod";

const joinSchema = z.object({ roomId: z.string(), userId: z.string(), name: z.string() });
const stateSchema = z.object({
  position: z.tuple([z.number(), z.number(), z.number()]),
  rotation: z.tuple([z.number(), z.number(), z.number()]),
  velocity: z.tuple([z.number(), z.number(), z.number()])
});
const chatSchema = z.object({ message: z.string().min(1).max(250) });
const finishSchema = z.object({
  roomId: z.string(),
  userId: z.string(),
  time: z.number()
});

export function registerLobbyNamespace(namespace: Namespace) {
  namespace.on("connection", async (socket) => {
    const rooms = await prisma.room.findMany({
      include: { _count: { select: { chat: true } } }
    });
    socket.emit(
      "lobby_snapshot",
      rooms.map((room) => ({
        id: room.id,
        name: room.name,
        status: room.status,
        worldId: room.worldId,
        players: room._count.chat,
        maxPlayers: room.maxPlayers
      }))
    );
  });
}

export function registerRoomNamespace(io: Server) {
  io.of(/^\/room:.+$/).on("connection", (socket) => {
    attachRoomHandlers(socket);
  });
}

const connectedUsers = new Map<string, Set<string>>();

function attachRoomHandlers(socket: Socket) {
  socket.on("join_room", async (payload) => {
    const parsed = joinSchema.safeParse(payload);
    if (!parsed.success) return;
    const { roomId, userId, name } = parsed.data;

    socket.join(roomId);
    const roomUsers = connectedUsers.get(roomId) ?? new Set<string>();
    roomUsers.add(userId);
    connectedUsers.set(roomId, roomUsers);

    socket.to(roomId).emit("user_joined", { userId, name });
  });

  socket.on("state_update", (payload) => {
    const parsed = stateSchema.safeParse(payload);
    if (!parsed.success) return;
    const roomId = [...socket.rooms].find((room) => room !== socket.id);
    if (!roomId) return;
    socket.to(roomId).emit("state_update", parsed.data);
  });

  socket.on("chat_message", async (payload) => {
    const parsed = chatSchema.safeParse(payload);
    if (!parsed.success) return;
    const roomId = [...socket.rooms].find((room) => room !== socket.id);
    if (!roomId) return;
    const { cleanText, flagged } = sanitizeMessage(parsed.data.message);
    socket.to(roomId).emit("chat_message", { message: cleanText, flagged });
  });

  socket.on("finish_time", async (payload) => {
    const parsed = finishSchema.safeParse(payload);
    if (!parsed.success) return;
    await prisma.auditLog.create({
      data: {
        actorId: parsed.data.userId,
        action: `finish:${parsed.data.roomId}:${parsed.data.time}`
      }
    });
    const roomId = [...socket.rooms].find((room) => room !== socket.id);
    if (!roomId) return;
    socket.to(roomId).emit("finish_time", parsed.data);
  });

  socket.on("report_user", async (payload) => {
    const schema = z.object({ reporterId: z.string(), targetUserId: z.string(), reason: z.string().min(3) });
    const parsed = schema.safeParse(payload);
    if (!parsed.success) return;
    await prisma.report.create({ data: parsed.data });
    socket.emit("report_confirmed");
  });

  socket.on("disconnecting", () => {
    const roomId = [...socket.rooms].find((room) => room !== socket.id);
    if (!roomId) return;
    connectedUsers.get(roomId)?.forEach((userId) => {
      if (socket.id.endsWith(userId)) {
        connectedUsers.get(roomId)?.delete(userId);
        socket.to(roomId).emit("user_left", { userId });
      }
    });
  });
}
