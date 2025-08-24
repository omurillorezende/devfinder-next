export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="max-w-xl w-full space-y-4">
        <h1 className="text-3xl font-bold">DevFinder</h1>
        <p className="text-sm opacity-80">
          Busque perfis do GitHub por usuário e veja métricas rapidamente.
        </p>
        <input
          className="w-full border rounded-xl p-3 outline-none focus:ring"
          placeholder="Digite um usuário, ex: torvalds"
        />
      </div>
    </main>
  );
}
