import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

const router = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post("/login", async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.NEXTAUTH_SECRET ?? "secret", {
    expiresIn: "12h"
  });

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      coins: user.coins
    }
  });
});

router.post("/register", async (req, res) => {
  const parsed = credentialsSchema.extend({ name: z.string().min(2) }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const { email, password, name } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashed
    }
  });

  return res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });
});

router.get("/me", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ message: "Missing authorization" });
  }
  try {
    const [, token] = auth.split(" ");
    const payload = jwt.verify(token, process.env.NEXTAUTH_SECRET ?? "secret") as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      coins: user.coins
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
