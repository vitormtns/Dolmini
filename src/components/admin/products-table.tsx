"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product, ProductStatus } from "@/lib/commerce/products/product.types";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusLabels: Record<ProductStatus, string> = {
  draft: "Rascunho",
  active: "Ativo",
  archived: "Arquivado",
  out_of_stock: "Esgotado"
};

const statusStyles: Record<ProductStatus, string> = {
  draft: "border-amber-200 bg-amber-50 text-amber-700",
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  archived: "border-zinc-200 bg-zinc-100 text-zinc-700",
  out_of_stock: "border-red-200 bg-red-50 text-red-700"
};

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-medium", statusStyles[status])}>
      {statusLabels[status]}
    </span>
  );
}

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();

  async function archiveProduct(id: string) {
    if (!confirm("Arquivar este produto?")) return;
    const response = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    if (!response.ok) {
      const body = await response.json();
      alert(body.error ?? "Nao foi possivel arquivar.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Preco</th>
              <th className="px-4 py-3">Estoque</th>
              <th className="px-4 py-3">Sinais</th>
              <th className="px-4 py-3 text-right">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => {
              const image = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)[0];
              return (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                        {image?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img alt={image.altText ?? product.name} className="h-full w-full object-cover" src={image.url} />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><ProductStatusBadge status={product.status} /></td>
                  <td className="px-4 py-3">
                    <p>{formatCurrency(product.salePrice ?? product.price)}</p>
                    {product.salePrice ? <p className="text-xs text-muted-foreground line-through">{formatCurrency(product.price)}</p> : null}
                  </td>
                  <td className="px-4 py-3">{product.stockQuantity}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {product.isFeatured ? <span className="rounded bg-muted px-2 py-1 text-xs">Destaque</span> : null}
                      {product.isPromotion ? <span className="rounded bg-muted px-2 py-1 text-xs">Promocao</span> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link className="rounded-md border px-3 py-2 text-xs font-medium" href={`/admin/produtos/${product.id}/editar`}>
                        Editar
                      </Link>
                      {product.status !== "archived" ? (
                        <button className="rounded-md border px-3 py-2 text-xs font-medium text-red-700" onClick={() => archiveProduct(product.id)} type="button">
                          Arquivar
                        </button>
                      ) : null}
                    </div>
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
