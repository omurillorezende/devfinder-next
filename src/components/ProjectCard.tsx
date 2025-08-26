import Image from "next/image";

export function ProjectCard({ p }: { p: any }) {
  const topics: string[] = p.topics ?? [];
  const avatar = `https://avatars.githubusercontent.com/${p.owner}`;
  return (
    <a href={`https://github.com/${p.fullName}`} target="_blank"
       className="block rounded-xl p-4 bg-neutral-900/50 hover:bg-neutral-900 transition">
      <div className="flex items-center gap-3">
        <Image src={avatar} alt={p.owner} width={32} height={32} className="rounded-full"/>
        <div className="flex-1">
          <h3 className="font-semibold">{p.fullName}</h3>
          {p.description && (
  <p className="mt-1 text-sm opacity-75 line-clamp-2">{p.description}</p>
     )}
        </div>
        <div className="text-sm opacity-80 text-right min-w-28">
          ⭐ {p.stars}<br/>🍴 {p.forks}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {p.language && <span className="text-xs px-2 py-1 rounded bg-neutral-800">{p.language}</span>}
        {topics.slice(0, 6).map(t => (
          <span key={t} className="text-xs px-2 py-1 rounded bg-neutral-800">{t}</span>
        ))}
      </div>
      <div className="mt-2 text-xs opacity-70">
        🔥 {p.scoreTrending?.toFixed?.(2)} · 🏆 {p.scoreAllTime?.toFixed?.(2)}
      </div>
    </a>
  );
}
