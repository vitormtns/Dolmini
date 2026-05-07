"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/commerce/products/product.types";

export function ProductImageUploader({ product }: { product: Product }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const images = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    const response = await fetch(`/api/admin/products/${product.id}/images`, {
      method: "POST",
      body: formData
    });
    const body = await response.json();
    setUploading(false);

    if (!response.ok || !body.success) {
      setError(body.error ?? "Não foi possível enviar imagens.");
      return;
    }

    router.refresh();
  }

  async function remove(imageId: string) {
    if (!confirm("Remover esta imagem?")) return;
    const response = await fetch(`/api/admin/products/${product.id}/images`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId })
    });
    if (!response.ok) {
      const body = await response.json();
      setError(body.error ?? "Não foi possível remover a imagem.");
      return;
    }
    router.refresh();
  }

  async function setPrimary(imageId: string) {
    const response = await fetch(`/api/admin/products/${product.id}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId })
    });
    if (!response.ok) {
      const body = await response.json();
      setError(body.error ?? "Não foi possível definir a imagem principal.");
      return;
    }
    router.refresh();
  }

  return (
    <section className="rounded-lg border bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Imagens</h2>
          <p className="text-sm text-muted-foreground">JPEG, PNG ou WebP até 5 MB por imagem.</p>
        </div>
        <label className="inline-flex cursor-pointer rounded-md border px-4 py-2 text-sm font-medium">
          {uploading ? "Enviando..." : "Enviar imagens"}
          <input accept="image/jpeg,image/png,image/webp" className="sr-only" multiple type="file" onChange={(event) => upload(event.target.files)} />
        </label>
      </div>
      {error ? <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {images.map((image, index) => (
          <div className="overflow-hidden rounded-lg border" key={image.id}>
            <div className="relative aspect-square bg-muted">
              {image.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={image.altText ?? product.name} className="h-full w-full object-cover" src={image.url} />
              ) : null}
            </div>
            <div className="flex items-center justify-between gap-2 p-3">
              <span className="text-xs text-muted-foreground">{index === 0 ? "Principal" : `Ordem ${index + 1}`}</span>
              <div className="flex gap-2">
                {index !== 0 ? <button className="text-xs font-medium" onClick={() => setPrimary(image.id)} type="button">Principal</button> : null}
                <button className="text-xs font-medium text-red-700" onClick={() => remove(image.id)} type="button">Remover</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
