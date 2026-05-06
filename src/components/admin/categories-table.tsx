"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, CategoryStatus } from "@/lib/commerce/categories/category.types";
import { slugify } from "@/lib/format";

export function CategoriesTable({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Record<string, Category>>({});
  const [error, setError] = useState<string | null>(null);

  function current(category: Category) {
    return editing[category.id] ?? category;
  }

  function update(id: string, patch: Partial<Category>) {
    setEditing((state) => ({
      ...state,
      [id]: { ...(state[id] ?? categories.find((category) => category.id === id)!), ...patch }
    }));
  }

  async function save(category: Category) {
    setError(null);
    const response = await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        status: category.status,
        sortOrder: category.sortOrder
      })
    });
    const body = await response.json();

    if (!response.ok || !body.success) {
      setError(body.error ?? "Nao foi possivel salvar categoria.");
      return;
    }

    setEditing((state) => {
      const next = { ...state };
      delete next[category.id];
      return next;
    });
    router.refresh();
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      {error ? <p className="m-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ordem</th>
              <th className="px-4 py-3 text-right">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((category) => {
              const row = current(category);
              return (
                <tr key={category.id}>
                  <td className="px-4 py-3">
                    <input className="w-full rounded-md border px-3 py-2" value={row.name} onChange={(event) => update(category.id, { name: event.target.value, slug: slugify(event.target.value) })} />
                  </td>
                  <td className="px-4 py-3">
                    <input className="w-full rounded-md border px-3 py-2" value={row.slug} onChange={(event) => update(category.id, { slug: slugify(event.target.value) })} />
                  </td>
                  <td className="px-4 py-3">
                    <select className="rounded-md border px-3 py-2" value={row.status} onChange={(event) => update(category.id, { status: event.target.value as CategoryStatus })}>
                      <option value="draft">Rascunho</option>
                      <option value="active">Ativa</option>
                      <option value="archived">Arquivada</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input className="w-20 rounded-md border px-3 py-2" min="0" type="number" value={row.sortOrder} onChange={(event) => update(category.id, { sortOrder: Number(event.target.value) })} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground" onClick={() => save(row)} type="button">
                      Salvar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
