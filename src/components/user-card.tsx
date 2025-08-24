import Image from "next/image";
import type { GitHubUser } from "@/types/github";

export function UserCard({ data }: { data: GitHubUser }) {
  return (
    <div className="border rounded-xl p-4 space-y-2" aria-label="Resumo do usuário">
      <div className="flex items-center gap-4">
        <Image src={data.avatar_url} alt={`Avatar de ${data.login}`} width={64} height={64} className="rounded-full" />
        <div>
          <h2 className="text-xl font-semibold">{data.name ?? data.login}</h2>
          <p className="text-sm opacity-80">@{data.login}</p>
        </div>
      </div>
      {data.bio && <p className="text-sm opacity-80">{data.bio}</p>}
      <div className="text-sm grid grid-cols-3 gap-2">
        <span>Repos: <strong>{data.public_repos}</strong></span>
        <span>Followers: <strong>{data.followers}</strong></span>
        <span>Following: <strong>{data.following}</strong></span>
      </div>
      <a className="text-sm underline" href={data.html_url} target="_blank" rel="noreferrer">
        Ver no GitHub
      </a>
    </div>
  );
}
