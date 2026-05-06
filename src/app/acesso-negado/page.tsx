import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acesso negado | Dolmini Model"
};

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <section className="max-w-md rounded-lg border bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Acesso negado
        </p>
        <h1 className="mt-3 text-2xl font-semibold">Usuario sem permissao admin</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          A sessao foi encerrada. Entre com uma conta que tenha role admin em `profiles`.
        </p>
        <Link className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" href="/login">
          Voltar ao login
        </Link>
      </section>
    </main>
  );
}
