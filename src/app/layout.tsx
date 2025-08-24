import "./globals.css";
import type { Metadata } from "next";
import QueryProvider from "@/components/query-provider";

export const metadata: Metadata = {
  title: "DevFinder",
  description: "Busque perfis do GitHub e visualize métricas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
