"use client";
export default function Error() {
  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="max-w-3xl w-full space-y-3">
        <h1 className="text-2xl font-bold">Ops, algo deu errado</h1>
        <p className="opacity-80">Tente recarregar a página ou voltar e buscar novamente.</p>
      </div>
    </main>
  );
}
