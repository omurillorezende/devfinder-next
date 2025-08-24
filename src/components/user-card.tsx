export function UserCard({ data }: { data: any }) {
  if (!data) return null;
  return (
    <div className="border rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-4">
        <img src={data.avatar_url} alt={data.login} className="w-16 h-16 rounded-full" />
        <div>
          <h2 className="text-xl font-semibold">{data.name || data.login}</h2>
          <p className="text-sm opacity-80">@{data.login}</p>
        </div>
      </div>
      {data.bio && <p className="text-sm opacity-80">{data.bio}</p>}
      <div className="text-sm grid grid-cols-3 gap-2">
        <span>Repos: <strong>{data.public_repos}</strong></span>
        <span>Followers: <strong>{data.followers}</strong></span>
        <span>Following: <strong>{data.following}</strong></span>
      </div>
      {data.html_url && (
        <a className="text-sm underline" href={data.html_url} target="_blank">
          Ver no GitHub
        </a>
      )}
    </div>
  );
}

