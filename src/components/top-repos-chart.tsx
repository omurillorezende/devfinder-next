"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function TopReposChart({ data }: { data: { name: string; stars: number; url: string }[] }) {
  if (!data?.length) return null;
  return (
    <div className="border rounded-xl p-4 space-y-2">
      <h3 className="font-semibold">Top Repositórios por ⭐</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stars" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs opacity-70">
        Dica: toque nas barras para ver os nomes completos.
      </div>
    </div>
  );
}
