"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/commerce/categories/category.types";
import type { Product, ProductStatus } from "@/lib/commerce/products/product.types";
import { slugify } from "@/lib/format";

type ProductFormState = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  price: string;
  salePrice: string;
  stockQuantity: string;
  status: ProductStatus;
  isFeatured: boolean;
  isPromotion: boolean;
  seoTitle: string;
  seoDescription: string;
};

export function ProductForm({
  product,
  categories
}: {
  product?: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(product?.slug));
  const initialState = useMemo<ProductFormState>(() => ({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    categoryId: product?.categoryId ?? "",
    price: product?.price ? String(product.price) : "",
    salePrice: product?.salePrice ? String(product.salePrice) : "",
    stockQuantity: product ? String(product.stockQuantity) : "0",
    status: product?.status ?? "draft",
    isFeatured: product?.isFeatured ?? false,
    isPromotion: product?.isPromotion ?? false,
    seoTitle: product?.seoTitle ?? "",
    seoDescription: product?.seoDescription ?? ""
  }), [product]);
  const [form, setForm] = useState<ProductFormState>(initialState);

  function update<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !slugTouched) next.slug = slugify(String(value));
      return next;
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...(product ? { id: product.id } : {}),
      name: form.name,
      slug: form.slug || slugify(form.name),
      shortDescription: form.shortDescription || null,
      description: form.description || null,
      categoryId: form.categoryId || null,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      stockQuantity: Number(form.stockQuantity),
      status: form.status,
      isFeatured: form.isFeatured,
      isPromotion: form.isPromotion,
      seoTitle: form.seoTitle || null,
      seoDescription: form.seoDescription || null
    };

    const response = await fetch("/api/admin/products", {
      method: product ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await response.json();
    setSaving(false);

    if (!response.ok || !body.success) {
      setError(body.error ?? "Não foi possível salvar o produto.");
      return;
    }

    const savedId = body.data.product.id;
    router.push(`/admin/produtos/${savedId}/editar`);
    router.refresh();
  }

  return (
    <form className="grid gap-5" onSubmit={submit}>
      {error ? <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      <div className="grid gap-4 rounded-lg border bg-white p-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Nome
          <input className="rounded-md border px-3 py-2" required value={form.name} onChange={(event) => update("name", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Slug
          <input className="rounded-md border px-3 py-2" required value={form.slug} onChange={(event) => { setSlugTouched(true); update("slug", slugify(event.target.value)); }} />
        </label>
        <label className="grid gap-2 text-sm font-medium md:col-span-2">
          Descrição curta
          <textarea className="min-h-20 rounded-md border px-3 py-2" value={form.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium md:col-span-2">
          Descrição completa
          <textarea className="min-h-32 rounded-md border px-3 py-2" value={form.description} onChange={(event) => update("description", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Categoria
          <select className="rounded-md border px-3 py-2" value={form.categoryId} onChange={(event) => update("categoryId", event.target.value)}>
            <option value="">Sem categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Status
          <select className="rounded-md border px-3 py-2" value={form.status} onChange={(event) => update("status", event.target.value as ProductStatus)}>
            <option value="draft">Rascunho</option>
            <option value="active">Ativo</option>
            <option value="out_of_stock">Esgotado</option>
            <option value="archived">Arquivado</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Preço normal
          <input className="rounded-md border px-3 py-2" min="0.01" required step="0.01" type="number" value={form.price} onChange={(event) => update("price", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Preço promocional
          <input className="rounded-md border px-3 py-2" min="0.01" step="0.01" type="number" value={form.salePrice} onChange={(event) => update("salePrice", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Estoque
          <input className="rounded-md border px-3 py-2" min="0" required step="1" type="number" value={form.stockQuantity} onChange={(event) => update("stockQuantity", event.target.value)} />
        </label>
        <div className="flex flex-wrap items-center gap-4 pt-6">
          <label className="inline-flex items-center gap-2 text-sm font-medium">
            <input checked={form.isFeatured} type="checkbox" onChange={(event) => update("isFeatured", event.target.checked)} />
            Destaque
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-medium">
            <input checked={form.isPromotion} type="checkbox" onChange={(event) => update("isPromotion", event.target.checked)} />
            Promoção
          </label>
        </div>
      </div>
      <div className="grid gap-4 rounded-lg border bg-white p-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Título SEO
          <input className="rounded-md border px-3 py-2" value={form.seoTitle} onChange={(event) => update("seoTitle", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Descrição SEO
          <input className="rounded-md border px-3 py-2" value={form.seoDescription} onChange={(event) => update("seoDescription", event.target.value)} />
        </label>
      </div>
      <div className="flex justify-end">
        <button className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60" disabled={saving} type="submit">
          {saving ? "Salvando..." : "Salvar produto"}
        </button>
      </div>
    </form>
  );
}
