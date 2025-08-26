/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // não roda ESLint no build de produção
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

