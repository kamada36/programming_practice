/** @type {import('next').NextConfig} */
const nextConfig = {
  // 完全無料の静的ホスティング（Netlify / Vercel いずれも可）のため静的HTML出力
  output: "export",
  // 静的ホスティングでの相対リンク解決を安定させる
  trailingSlash: true,
  images: {
    // next/image の最適化サーバーを使わない（SSG のため）
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
