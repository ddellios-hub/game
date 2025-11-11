"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@sandbox/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("player@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password
    });
    setLoading(false);
    if (res?.error) {
      setError(res.error);
      return;
    }
    router.replace("/lobby");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
      <Card className="w-full max-w-md bg-white/95 p-6" title="Sign in">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-600" htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring"
            />
          </label>
          <label className="block text-sm font-medium text-slate-600" htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring"
            />
          </label>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={() => signIn("google")}
          >
            Sign in with Google
          </Button>
        </form>
      </Card>
    </div>
  );
}
