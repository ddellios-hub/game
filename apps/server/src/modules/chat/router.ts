import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { sanitizeMessage } from "@sandbox/game-core";

const router = Router();

const chatSchema = z.object({
  roomId: z.string(),
  userId: z.string(),
  message: z.string().min(1).max(250)
});

router.get("/:roomId", async (req, res) => {
  const messages = await prisma.chatMessage.findMany({
    where: { roomId: req.params.roomId },
    take: 50,
    orderBy: { createdAt: "desc" }
  });
  return res.json(messages.reverse());
});

router.post("/", async (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload" });
  }
  const { cleanText, flagged } = sanitizeMessage(parsed.data.message);
  const message = await prisma.chatMessage.create({
    data: {
      roomId: parsed.data.roomId,
      userId: parsed.data.userId,
      message: cleanText
    }
  });
  return res.status(flagged.clean ? 201 : 202).json({ message, flagged });
});

export default router;
