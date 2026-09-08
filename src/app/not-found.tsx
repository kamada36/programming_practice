import Link from "next/link";
import { Coffee } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 text-center">
      <div>
        <Coffee className="mx-auto h-10 w-10 text-accent" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          ページが見つかりません
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          お探しのレシピは移動または削除された可能性があります。
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          レシピ一覧へ戻る
        </Link>
      </div>
    </div>
  );
}
