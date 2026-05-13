"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/commerce/categories/category.types";
import type { Product, ProductStatus, ProductVariant } from "@/lib/commerce/products/product.types";
import { slugify } from "@/lib/format";

type ProductVariantFormState = {
  id?: string;
  size: string;
  color: string;
  sku: string;
  stockQuantity: string;
  price: string;
  isActive: boolean;
};

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
  variants: ProductVariantFormState[];
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
    seoDescription: product?.seoDescription ?? "",
    variants: product?.variants.map(toVariantFormState) ?? []
  }), [product]);
  const [form, setForm] = useState<ProductFormState>(initialState);

  function update<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !slugTouched) next.slug = slugify(String(value));
      return next;
    });
  }

  function addVariant() {
    setForm((current) => ({
      ...current,
      variants: [
        ...current.variants,
        {
          size: "",
          color: "",
          sku: "",
          stockQuantity: "0",
          price: "",
          isActive: true
        }
      ]
    }));
  }

  function updateVariant<K extends keyof ProductVariantFormState>(
    index: number,
    key: K,
    value: ProductVariantFormState[K]
  ) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, candidateIndex) =>
        candidateIndex === index ? { ...variant, [key]: value } : variant
      )
    }));
  }

  function removeVariant(index: number) {
    setForm((current) => ({
      ...current,
      variants: current.variants.filter((_, candidateIndex) => candidateIndex !== index)
    }));
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
      seoDescription: form.seoDescription || null,
      variants: form.variants.map((variant) => ({
        id: variant.id,
        size: variant.size.trim() || null,
        color: variant.color.trim() || null,
        sku: variant.sku.trim() || null,
        stockQuantity: Number(variant.stockQuantity),
        price: variant.price ? Number(variant.price) : null,
        isActive: variant.isActive
      }))
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
          Estoque do produto simples
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

      <section className="grid gap-4 rounded-lg border bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Variações</h2>
            <p className="text-sm text-muted-foreground">Use para tamanho, numeração, cor e estoque por opção. Produtos sem variações continuam funcionando normalmente.</p>
          </div>
          <button className="rounded-md border px-4 py-2 text-sm font-medium" type="button" onClick={addVariant}>
            Adicionar variação
          </button>
        </div>

        {form.variants.length === 0 ? (
          <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">Nenhuma variação cadastrada.</p>
        ) : (
          <div className="grid gap-3">
            {form.variants.map((variant, index) => (
              <div className="grid gap-3 rounded-md border p-3 md:grid-cols-6" key={variant.id ?? index}>
                <label className="grid gap-1 text-sm font-medium">
                  Tamanho
                  <input className="rounded-md border px-3 py-2" placeholder="P, M, G, 36, 38..." value={variant.size} onChange={(event) => updateVariant(index, "size", event.target.value)} />
                </label>
                <label className="grid gap-1 text-sm font-medium">
                  Cor
                  <input className="rounded-md border px-3 py-2" placeholder="Azul claro" value={variant.color} onChange={(event) => updateVariant(index, "color", event.target.value)} />
                </label>
                <label className="grid gap-1 text-sm font-medium">
                  SKU
                  <input className="rounded-md border px-3 py-2" value={variant.sku} onChange={(event) => updateVariant(index, "sku", event.target.value)} />
                </label>
                <label className="grid gap-1 text-sm font-medium">
                  Estoque
                  <input className="rounded-md border px-3 py-2" min="0" step="1" type="number" value={variant.stockQuantity} onChange={(event) => updateVariant(index, "stockQuantity", event.target.value)} />
                </label>
                <label className="grid gap-1 text-sm font-medium">
                  Preço próprio
                  <input className="rounded-md border px-3 py-2" min="0.01" placeholder="Opcional" step="0.01" type="number" value={variant.price} onChange={(event) => updateVariant(index, "price", event.target.value)} />
                </label>
                <div className="flex flex-wrap items-end gap-3">
                  <label className="inline-flex min-h-10 items-center gap-2 text-sm font-medium">
                    <input checked={variant.isActive} type="checkbox" onChange={(event) => updateVariant(index, "isActive", event.target.checked)} />
                    Ativa
                  </label>
                  <button className="min-h-10 text-sm font-semibold text-red-700" type="button" onClick={() => removeVariant(index)}>
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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

function toVariantFormState(variant: ProductVariant): ProductVariantFormState {
  return {
    id: variant.id,
    size: variant.size ?? "",
    color: variant.color ?? "",
    sku: variant.sku ?? "",
    stockQuantity: String(variant.stockQuantity),
    price: variant.price == null ? "" : String(variant.price),
    isActive: variant.isActive
  };
}
