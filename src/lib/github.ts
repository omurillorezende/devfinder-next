export async function fetchGitHubUser(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}`);

  if (!res.ok) {
    throw new Error(`Erro ao buscar usuário: ${res.status}`);
  }

  return res.json();
}
