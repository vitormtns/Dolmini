import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login admin | Dolmini Model",
  description: "Acesso administrativo da Dolmini Model."
};

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Dolmini Model
          </p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight">
            Acesso seguro ao painel da loja.
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Entre com o usuario admin cadastrado no Supabase para gerenciar catalogo, imagens e pedidos.
          </p>
        </section>
        <section className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Login admin</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Nao ha cadastro publico nesta loja.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
