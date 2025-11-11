import type { CollisionResult, PhysicsBody } from "./types";

const GRAVITY = -9.81;

export interface PhysicsWorldOptions {
  floorY?: number;
  damping?: number;
}

export class PhysicsWorld {
  private readonly floorY: number;
  private readonly damping: number;

  constructor(options: PhysicsWorldOptions = {}) {
    this.floorY = options.floorY ?? 0;
    this.damping = options.damping ?? 0.98;
  }

  integrate(body: PhysicsBody, dt: number): PhysicsBody {
    const next = { ...body };
    next.velocity = [
      next.velocity[0] * this.damping,
      next.velocity[1] + GRAVITY * dt,
      next.velocity[2] * this.damping
    ];

    next.position = [
      next.position[0] + next.velocity[0] * dt,
      next.position[1] + next.velocity[1] * dt,
      next.position[2] + next.velocity[2] * dt
    ];

    if (next.position[1] - next.size[1] / 2 <= this.floorY) {
      next.position[1] = this.floorY + next.size[1] / 2;
      next.velocity[1] = 0;
      next.grounded = true;
    } else {
      next.grounded = false;
    }

    return next;
  }

  resolveCollision(a: PhysicsBody, b: PhysicsBody): CollisionResult {
    const overlapX = Math.abs(a.position[0] - b.position[0]) <= (a.size[0] + b.size[0]) / 2;
    const overlapY = Math.abs(a.position[1] - b.position[1]) <= (a.size[1] + b.size[1]) / 2;
    const overlapZ = Math.abs(a.position[2] - b.position[2]) <= (a.size[2] + b.size[2]) / 2;

    if (overlapX && overlapY && overlapZ) {
      const normal: [number, number, number] = [0, 1, 0];
      return { collided: true, normal };
    }

    return { collided: false, normal: [0, 0, 0] };
  }
}
