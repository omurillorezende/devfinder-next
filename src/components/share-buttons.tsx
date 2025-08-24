"use client";

export function ShareButtons({ username }: { username: string }) {
  const url = typeof window !== "undefined" ? window.location.href : "";

  async function copy() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url || `/u/${username}`);
      alert("Link copiado! 👍");
    }
  }

  return (
    <div className="flex gap-2">
      <button className="rounded-xl border px-3 py-2" onClick={copy}>
        Copiar link
      </button>
      <a
        className="rounded-xl border px-3 py-2"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url || `/u/${username}`)}`}
        target="_blank"
        rel="noreferrer"
      >
        Compartilhar no LinkedIn
      </a>
    </div>
  );
}
