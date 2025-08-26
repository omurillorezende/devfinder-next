// src/lib/scoring.ts

// log natural "seguro" para zeros/negativos
const LN = (n: number) => Math.log1p(Math.max(0, n));

/** Decaimento exponencial (meia-vida ~90 dias) para o "Trending" */
function recencyBoost(lastPushedAt: Date, halfLifeDays = 90) {
  const ageDays = (Date.now() - lastPushedAt.getTime()) / 86_400_000;
  const lambda = Math.log(2) / halfLifeDays;
  return Math.exp(-lambda * ageDays);
}

/** Sinais simples de qualidade do repo */
function qualitySignals(p: { hasHomepage: boolean; readmeSize: number; topics: any }) {
  const t = (p.topics as string[] | null) ?? []; // topics é Json no Prisma
  let s = 0;
  if (p.hasHomepage) s += 0.5;
  if (p.readmeSize > 10_240) s += 0.7; // >10KB
  if (t.length >= 3) s += 0.3;
  return s;
}

export function scoreAllTime(p: any) {
  return (
    2.0 * LN(p.stars) +
    1.2 * LN(p.forks) +
    0.6 * LN(p.watchers) +
    0.4 * LN(p.ownerFollowers) -
    0.3 * LN(p.openIssues) +
    qualitySignals(p)
  );
}

export function scoreTrending(p: any) {
  const base =
    1.6 * LN(p.stars) +
    1.0 * LN(p.forks) +
    0.5 * LN(p.watchers) +
    qualitySignals(p);
  return base * (0.6 + 0.4 * recencyBoost(new Date(p.lastPushedAt)));
}
