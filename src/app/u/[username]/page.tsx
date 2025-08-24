import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { UserCard } from "@/components/user-card";
import { TopReposChart } from "@/components/top-repos-chart";
import { ShareButtons } from "@/components/share-buttons";
import type { GitHubUser, TopRepo } from "@/types/github";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteParams = { username: string };

function ghHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "User-Agent": "devfinder-next" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

async function getUser(username: string): Promise<GitHubUser | null> {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: ghHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

async function getTopRepos(username: string): Promise<TopRepo[] | null> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers: ghHeaders(), cache: "no-store" }
  );
  if (!res.ok) return null;

  const repos = (await res.json()) as any[];
  if (!Array.isArray(repos)) return null;

  return repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((r) => ({
      name: r.name,
      stars: r.stargazers_count,
      url: r.html_url,
      language: r.language ?? null,
    }));
}

export async function generateMetadata(
  { params }: { params: Promise<RouteParams> }
): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `DevFinder — ${username}`,
    description: `Perfil GitHub e top repositórios de ${username}`,
  };
}

export default async function Page(
  { params }: { params: Promise<RouteParams> }
) {
  const { username } = await params;

  const [user, repos] = await Promise.all([getUser(username), getTopRepos(username)]);
  if (!user) notFound();

  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="max-w-3xl w-full space-y-6">
        <h1 className="text-3xl font-bold">DevFinder</h1>

        <UserCard data={user} />

        {repos?.length ? (
          <TopReposChart data={repos} />
        ) : (
          <p className="text-sm opacity-70">Sem repositórios populares.</p>
        )}

        <ShareButtons username={username} />
      </div>
    </main>
  );
}
