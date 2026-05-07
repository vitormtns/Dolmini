"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/format";

export function CategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"active" | "draft" | "archived">("draft");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: slug || slugify(name),
        description: description || null,
        status
      })
    });
    const body = await response.json();
    setSaving(false);

    if (!response.ok || !body.success) {
      setError(body.error ?? "Não foi possível criar a categoria.");
      return;
    }

    setName("");
    setSlug("");
    setDescription("");
    setStatus("draft");
    setSlugTouched(false);
    router.refresh();
  }

  return (
    <form className="grid gap-4 rounded-lg border bg-white p-5 md:grid-cols-4" onSubmit={submit}>
      {error ? <p className="md:col-span-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <label className="grid gap-2 text-sm font-medium">
        Nome
        <input className="rounded-md border px-3 py-2" required value={name} onChange={(event) => {
          setName(event.target.value);
          if (!slugTouched) setSlug(slugify(event.target.value));
        }} />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Slug
        <input className="rounded-md border px-3 py-2" required value={slug} onChange={(event) => {
          setSlugTouched(true);
          setSlug(slugify(event.target.value));
        }} />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Status
        <select className="rounded-md border px-3 py-2" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
          <option value="draft">Rascunho</option>
          <option value="active">Ativa</option>
          <option value="archived">Arquivada</option>
        </select>
      </label>
      <div className="flex items-end">
        <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60" disabled={saving} type="submit">
          {saving ? "Criando..." : "Criar categoria"}
        </button>
      </div>
      <label className="grid gap-2 text-sm font-medium md:col-span-4">
        Descrição
        <textarea className="min-h-20 rounded-md border px-3 py-2" value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
    </form>
  );
}
