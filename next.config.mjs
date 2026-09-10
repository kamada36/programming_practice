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
  experimental: {
    // ビルド最適化（page optimization / build traces）時のメモリ急増を抑える。
    // Worker スレッドを無効化し、並列度を 1 に絞ることで Vercel の
    // メモリ上限内でビルドを完了させる。
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
