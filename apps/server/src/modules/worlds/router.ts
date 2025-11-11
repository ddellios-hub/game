import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

const router = Router();

const worldSchema = z.object({
  name: z.string().min(3),
  json: z.record(z.any()),
  isPublished: z.boolean().default(false),
  type: z.enum(["OBBY", "PLATFORMER"])
});

router.get("/", async (_req, res) => {
  const worlds = await prisma.world.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" }
  });
  return res.json(worlds);
});

router.post("/", async (req, res) => {
  const parsed = worldSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload" });
  }
  const ownerId = req.body.ownerId ?? req.body.userId;
  if (!ownerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const world = await prisma.world.create({
    data: {
      ownerId,
      name: parsed.data.name,
      json: parsed.data.json,
      isPublished: parsed.data.isPublished,
      type: parsed.data.type
    }
  });
  return res.status(201).json(world);
});

router.post("/:id/publish", async (req, res) => {
  const { id } = req.params;
  const world = await prisma.world.update({
    where: { id },
    data: { isPublished: true }
  });
  return res.json(world);
});

export default router;
