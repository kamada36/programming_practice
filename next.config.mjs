/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify Free Plan での完全無料運用のため静的HTML出力
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
