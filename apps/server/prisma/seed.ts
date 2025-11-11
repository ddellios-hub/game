import { PrismaClient, Role, WorldType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD ?? "admin1234", 10);

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_DEFAULT_EMAIL ?? "admin@example.com" },
    update: {},
    create: {
      email: process.env.ADMIN_DEFAULT_EMAIL ?? "admin@example.com",
      name: "Admin",
      password,
      role: Role.ADMIN,
      coins: 1000
    }
  });

  const player = await prisma.user.upsert({
    where: { email: "player@example.com" },
    update: {},
    create: {
      email: "player@example.com",
      name: "Player One",
      password: await bcrypt.hash("password123", 10),
      role: Role.PLAYER,
      coins: 150
    }
  });

  const worlds = await prisma.$transaction([
    prisma.world.upsert({
      where: { id: "demo-world-1" },
      update: {},
      create: {
        id: "demo-world-1",
        ownerId: admin.id,
        name: "Starter Obby",
        type: WorldType.OBBY,
        isPublished: true,
        json: {
          palette: ["block", "spinner"],
          layout: [{ type: "start", position: [0, 0, 0] }]
        },
        likes: 25
      }
    }),
    prisma.world.upsert({
      where: { id: "demo-world-2" },
      update: {},
      create: {
        id: "demo-world-2",
        ownerId: admin.id,
        name: "Sky Platforms",
        type: WorldType.PLATFORMER,
        isPublished: true,
        json: {
          palette: ["platform", "coin"],
          layout: [{ type: "coin", position: [1, 0] }]
        },
        likes: 11
      }
    }),
    prisma.world.upsert({
      where: { id: "demo-world-3" },
      update: {},
      create: {
        id: "demo-world-3",
        ownerId: player.id,
        name: "Player Forge",
        type: WorldType.OBBY,
        isPublished: false,
        json: {
          palette: ["block", "lava"],
          layout: [{ type: "lava", position: [3, 0, 1] }]
        }
      }
    })
  ]);

  await prisma.room.upsert({
    where: { id: "demo-room-1" },
    update: {},
    create: {
      id: "demo-room-1",
      name: "Community Obby",
      ownerId: admin.id,
      worldId: worlds[0].id,
      maxPlayers: 12
    }
  });

  await prisma.room.upsert({
    where: { id: "demo-room-2" },
    update: {},
    create: {
      id: "demo-room-2",
      name: "Platform Party",
      ownerId: admin.id,
      worldId: worlds[1].id,
      maxPlayers: 12
    }
  });

  console.info("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
