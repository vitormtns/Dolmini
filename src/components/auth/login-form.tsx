"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const body = await response.json();
    setLoading(false);

    if (!response.ok || !body.success) {
      if (body.code === "admin_permission_required") {
        router.push("/acesso-negado");
        return;
      }

      setError(body.error ?? "Não foi possível entrar.");
      return;
    }

    router.push(body.data.redirectTo ?? "/admin");
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <label className="grid gap-2 text-sm font-medium">
        E-mail
        <input
          autoComplete="email"
          className="rounded-md border px-3 py-2"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Senha
        <input
          autoComplete="current-password"
          className="rounded-md border px-3 py-2"
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <button
        className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? "Entrando..." : "Entrar no painel"}
      </button>
    </form>
  );
}
