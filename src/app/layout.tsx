import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://resilient-cer.com"),
  title: {
    default: "コード・カフェ | 選んで、試して、味わうプログラミング",
    template: "%s | コード・カフェ",
  },
  description:
    "環境構築なし。ブラウザだけで、HTML/CSS/JavaScript・Python・Ruby のコードを1分で試せる 入門向けメニュー集。気になったコードを選んで、書き換えて、動きを味わえます。",
  openGraph: {
    type: "website",
    siteName: "コード・カフェ",
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
