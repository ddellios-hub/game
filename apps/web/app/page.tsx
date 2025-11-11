import Link from "next/link";
import { Button, Card } from "@sandbox/ui";
import { GlobeAltIcon, RocketLaunchIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { getDictionary } from "@sandbox/game-core";

export default function Home() {
  const t = getDictionary("en");
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16">
      <section className="text-center">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-6xl">{t.welcome}</h1>
        <p className="mt-4 text-lg text-slate-600">
          Build, play, and moderate community worlds in a safe multiplayer playground designed for 16-year-old creators.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/lobby">Enter lobby</Link>
          </Button>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        <Card
          title="Creator tools"
          actions={<GlobeAltIcon className="h-8 w-8 text-primary" aria-hidden="true" />}
          className="bg-white/90"
        >
          Drag and drop blocks, publish worlds, and invite friends.
        </Card>
        <Card
          title="Mini-games"
          actions={<RocketLaunchIcon className="h-8 w-8 text-primary" aria-hidden="true" />}
          className="bg-white/90"
        >
          Sprint through 3D obbies or collect coins in a 2D platformer.
        </Card>
        <Card
          title="Safety-first"
          actions={<ShieldCheckIcon className="h-8 w-8 text-primary" aria-hidden="true" />}
          className="bg-white/90"
        >
          Moderation dashboards, profanity filtering, and quick reports keep the lobby safe.
        </Card>
      </section>
    </main>
  );
}
