import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://resilient-cer.com"),
  title: {
    default: "コード・キッチン | 1分で動かす、実用プログラミングレシピ",
    template: "%s | コード・キッチン",
  },
  description:
    "環境構築なし。ブラウザだけで、HTML/CSS/JavaScript・Python・Ruby のコードを1分で動かせる 入門向けチュートリアル集。",
  openGraph: {
    type: "website",
    siteName: "コード・キッチン",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
