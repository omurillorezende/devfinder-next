import { Metadata } from "next";
import { notFound } from "next/navigation";
import { UserCard } from "@/components/user-card";
import { TopReposChart } from "@/components/top-repos-chart";
import type { GitHubUser, TopRepo } from "@/types/github";

type Props = { params: { username: string } };

async function getUser(username: string): Promise<GitHubUser | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/github/user?u=${username}`, {
    // garante que roda no server e pode revalidar
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

async function getTopRepos(username: string): Promise<TopRepo[] | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/github/repos?u=${username}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const u = params.username;
  return {
    title: `DevFinder — ${u}`,
    description: `Perfil GitHub e top repositórios de ${u}`,
    openGraph: {
      title: `DevFinder — ${u}`,
      description: `Perfil GitHub e top repositórios de ${u}`,
      url: `/u/${u}`,
      siteName: "DevFinder",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `DevFinder — ${u}`,
      description: `Perfil GitHub e top repositórios de ${u}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const username = params.username;
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

import { ShareButtons } from "@/components/share-buttons";

