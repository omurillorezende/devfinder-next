import Link from "next/link";
import Image from "next/image";

export type Project = {
  id: string;
  repoId: number;
  fullName: string;
  name: string;
  owner: string;
  description?: string | null;
  language?: string | null;
  topics?: string[] | null;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  hasHomepage: boolean;
  readmeSize: number;
  lastPushedAt: string | Date;
  ownerFollowers: number;
  scoreAllTime: number;
  scoreTrending: number;
};

function formatNumber(n: number) {
  return Intl.NumberFormat("en-US", { notation: "compact" }).format(n);
}
function timeAgo(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (day > 0) return `${day}d`;
  if (hr > 0) return `${hr}h`;
  if (min > 0) return `${min}m`;
  return `${sec}s`;
}
function LangBadge({ lang }: { lang?: string | null }) {
  if (!lang) return null;
  return (
    <span className="text-xs px-2 py-0.5 rounded-md border border-neutral-700 bg-neutral-800/60">
      {lang.toLowerCase()}
    </span>
  );
}

const ProjectCard = ({ p }: { p: Project }) => {
  const topics = (p.topics ?? []).slice(0, 6);
  const extra = Math.max(0, (p.topics?.length ?? 0) - topics.length);
  const avatar = `https://avatars.githubusercontent.com/${p.owner}`;
  const repoUrl = `https://github.com/${p.fullName}`;

  return (
    <article className="min-h-[160px] h-full rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-4 shadow-sm flex flex-col">
      {/* Header */}
      <header className="flex items-start gap-3">
        <Image
          src={avatar}
          alt={p.owner}
          width={36}
          height={36}
          className="rounded-full border border-neutral-700 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={repoUrl}
              target="_blank"
              className="font-semibold leading-tight hover:underline truncate"
              title={p.fullName}
            >
              {p.fullName}
            </Link>
            {p.hasHomepage && (
              <Link
                href={repoUrl}
                target="_blank"
                className="text-xs px-2 py-0.5 rounded-md border border-neutral-700 bg-neutral-800/60 hover:bg-neutral-800"
                title="Homepage"
              >
                site
              </Link>
            )}
            <LangBadge lang={p.language} />
          </div>

          {p.description && (
            <p className="mt-1 text-sm text-neutral-400 line-clamp-2">
              {p.description}
            </p>
          )}
        </div>
      </header>

      {/* Topics */}
      {(topics.length > 0 || extra > 0) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {topics.map((t) => (
            <span
              key={t}
              className="text-[11px] px-2 py-1 rounded-md border border-neutral-700 bg-neutral-900/70"
            >
              {t}
            </span>
          ))}
          {extra > 0 && (
            <span className="text-[11px] px-2 py-1 rounded-md border border-neutral-700 bg-neutral-900/70">
              +{extra}
            </span>
          )}
        </div>
      )}

      <div className="flex-1" />

      {/* Footer: métricas */}
      <footer className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-neutral-300">
        <div className="flex items-center gap-1.5" title="Stars">
          <span>⭐</span>
          <span className="tabular-nums">{formatNumber(p.stars)}</span>
        </div>
        <div className="flex items-center gap-1.5" title="Forks">
          <span>🍴</span>
          <span className="tabular-nums">{formatNumber(p.forks)}</span>
        </div>
        <div className="flex items-center gap-1.5" title="Watchers">
          <span>👀</span>
          <span className="tabular-nums">{formatNumber(p.watchers)}</span>
        </div>
        <div className="flex items-center gap-1.5" title="Issues abertas">
          <span>🐞</span>
          <span className="tabular-nums">{formatNumber(p.openIssues)}</span>
        </div>
        <div className="flex items-center gap-1.5" title="Followers do owner">
          <span>👤</span>
          <span className="tabular-nums">{formatNumber(p.ownerFollowers)}</span>
        </div>
        <div className="flex items-center gap-1.5" title="Último push">
          <span>⏱️</span>
          <span>{timeAgo(p.lastPushedAt)} atrás</span>
        </div>
      </footer>

      <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
        <span title="Score em alta">🔥 {p.scoreTrending.toFixed(2)}</span>
        <span title="Score todos os tempos">🏆 {p.scoreAllTime.toFixed(2)}</span>
      </div>
    </article>
  );
};

export { ProjectCard };        // export nomeado
export default ProjectCard;     // export default
