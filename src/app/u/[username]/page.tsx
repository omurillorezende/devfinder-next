import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UserCard } from "@/components/user-card";
import { TopReposChart } from "@/components/top-repos-chart";
import { ShareButtons } from "@/components/share-buttons";
import type { GitHubUser, TopRepo } from "@/types/github";

type RouteParams = { username: string };

async function getUser(username: string): Promise<GitHubUser | null> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const res = await fetch(`${base}/api/github/user?u=${username}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function getTopRepos(username: string): Promise<TopRepo[] | null> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const res = await fetch(`${base}/api/github/repos?u=${username}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

// Next 15: params pode ser Promise<>
export async function generateMetadata(
  { params }: { params: Promise<RouteParams> }
): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `DevFinder — ${username}`,
    description: `Perfil GitHub e top repositórios de ${username}`,
    openGraph: {
      title: `DevFinder — ${username}`,
      description: `Perfil GitHub e top repositórios de ${username}`,
      url: `/u/${username}`,
      siteName: "DevFinder",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `DevFinder — ${username}`,
      description: `Perfil GitHub e top repositórios de ${username}`,
    },
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
        {repos && repos.length > 0 ? (
          <TopReposChart data={repos} />
        ) : (
          <p className="text-sm opacity-70">Sem repositórios populares para exibir.</p>
        )}
        <ShareButtons username={username} />
      </div>
    </main>
  );
}
