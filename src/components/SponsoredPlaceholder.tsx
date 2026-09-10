import { cn } from "@/lib/utils";

interface SponsoredPlaceholderProps {
  /** banner=横長 / rectangle=中サイズ / inline=細い帯 */
  variant?: "banner" | "rectangle" | "inline";
  /** 位置がわかるようにするメモ（仮表示用） */
  note?: string;
  className?: string;
}

/**
 * 【仮】アフィリエイト／広告バナーの表示位置イメージ用プレースホルダー。
 * 実運用では ASP のバナーコードや商品リンクカードに差し替える。
 * サイトの方針上、必ず「PR / 広告」表記を添えること。
 */
export function SponsoredPlaceholder({
  variant = "banner",
  note,
  className,
}: SponsoredPlaceholderProps) {
  const box =
    variant === "banner"
      ? "min-h-[90px] sm:aspect-[728/90]"
      : variant === "rectangle"
        ? "aspect-[300/250] max-w-[300px]"
        : "min-h-[56px]";

  return (
    <div className={className}>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
        PR / 広告
      </p>
      <div
        className={cn(
          "grid w-full place-items-center rounded-lg border-2 border-dashed border-border text-center",
          "bg-muted/50 bg-[repeating-linear-gradient(45deg,transparent,transparent_9px,rgba(120,100,80,0.06)_9px,rgba(120,100,80,0.06)_18px)]",
          box,
        )}
      >
        <div className="px-4 py-3">
          <p className="text-xs font-bold text-muted-foreground">
            アフィリエイト / 広告バナー（サンプル）
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground/70">
            {note ?? "ここに ASP のバナーコードや商品リンクが入ります"}
          </p>
        </div>
      </div>
    </div>
  );
}
