'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Car, LogIn } from "lucide-react";

import { useAuth } from "../AuthProvider";

// Save this file as app/admin/login/page.tsx
export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Already logged in? Go straight to the dashboard.
  useEffect(() => {
    if (!loading && user) router.replace("/admin");
  }, [loading, user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // stop the page from reloading

    if (!login(username, password)) {
      setError("Wrong username or password.");
      return;
    }

    router.push("/admin");
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/15 via-background to-secondary/15 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-gradient">
            <Car className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-heading text-xl font-bold text-foreground">MONARA</span>
        </div>

        <h1 className="mt-6 text-center font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          Admin Login
        </h1>
        <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-brand-gradient" aria-hidden="true" />

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-xs font-semibold text-muted-foreground">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-semibold text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-gradient px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:glow-gold"
          >
            <LogIn className="h-4 w-4" />
            Log in
          </button>
        </form>
      </div>
    </main>
  );
}