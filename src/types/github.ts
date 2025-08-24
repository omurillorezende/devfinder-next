export type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
};

export type TopRepo = {
  name: string;
  stars: number;
  url: string;
  language: string | null;
};
