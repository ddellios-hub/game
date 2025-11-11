import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

const router = Router();

const reportSchema = z.object({
  reporterId: z.string(),
  targetUserId: z.string(),
  reason: z.string().min(3)
});

router.post("/", async (req, res) => {
  const parsed = reportSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload" });
  }
  const report = await prisma.report.create({ data: parsed.data });
  return res.status(201).json(report);
});

router.get("/", async (_req, res) => {
  const reports = await prisma.report.findMany({
    include: {
      reporter: { select: { id: true, name: true } },
      targetUser: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return res.json(reports);
});

router.post("/:id/ban", async (req, res) => {
  const schema = z.object({ reason: z.string().min(3), durationMinutes: z.number().min(1).max(60 * 24) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload" });
  }
  const report = await prisma.report.update({
    where: { id: req.params.id },
    data: { status: "ACTIONED" }
  });
  const ban = await prisma.ban.create({
    data: {
      userId: report.targetUserId,
      reason: parsed.data.reason,
      expiresAt: new Date(Date.now() + parsed.data.durationMinutes * 60_000)
    }
  });
  await prisma.auditLog.create({
    data: {
      actorId: req.body.actorId ?? req.body.userId ?? report.reporterId,
      action: `ban:${report.targetUserId}`,
      targetId: report.targetUserId
    }
  });
  return res.json({ report, ban });
});

export default router;
