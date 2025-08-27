/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true }, // (você já tinha colocado)
  images: {
    // use remotePatterns no Next 15
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" }, // opcional (readme/imagens)
      { protocol: "https", hostname: "github.com" }                 // opcional (fallbacks do GitHub)
    ],
  },
};

module.exports = nextConfig;
