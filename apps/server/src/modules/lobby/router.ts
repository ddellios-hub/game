import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

const router = Router();

const createRoomSchema = z.object({
  name: z.string().min(3),
  maxPlayers: z.number().int().min(2).max(12).default(12),
  worldId: z.string().optional()
});

router.get("/", async (_req, res) => {
  const rooms = await prisma.room.findMany({
    include: {
      _count: { select: { chat: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return res.json(
    rooms.map((room) => ({
      id: room.id,
      name: room.name,
      status: room.status,
      maxPlayers: room.maxPlayers,
      worldId: room.worldId,
      players: room._count.chat
    }))
  );
});

router.get("/:id", async (req, res) => {
  const room = await prisma.room.findUnique({
    where: { id: req.params.id },
    include: {
      world: true
    }
  });
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
  return res.json(room);
});

router.post("/", async (req, res) => {
  const parsed = createRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload" });
  }
  const ownerId = req.body.ownerId ?? req.body.userId;
  if (!ownerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const room = await prisma.room.create({
    data: {
      name: parsed.data.name,
      maxPlayers: parsed.data.maxPlayers,
      worldId: parsed.data.worldId,
      ownerId
    }
  });
  return res.status(201).json(room);
});

router.post("/quick-play", async (_req, res) => {
  const room = await prisma.room.findFirst({
    where: { status: "WAITING" },
    orderBy: { createdAt: "asc" }
  });
  if (!room) {
    return res.status(404).json({ message: "No rooms available" });
  }
  return res.json(room);
});

export default router;
