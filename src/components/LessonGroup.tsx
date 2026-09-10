import { levelTone } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { LevelMeta } from "@/types/recipe";
import { LessonRow, type LessonRowData } from "@/components/LessonRow";

interface LessonGroupProps {
  level: LevelMeta;
  lessons: LessonRowData[];
  /** 見出しに blurb を出すか（トップは簡潔に、コースページは説明多め）。 */
  showBlurb?: boolean;
  /** アンカー用 id。 */
  id?: string;
}

/** 難易度見出し + その難易度のレッスン行リスト。 */
export function LessonGroup({
  level,
  lessons,
  showBlurb = true,
  id,
}: LessonGroupProps) {
  if (lessons.length === 0) return null;
  const tone = levelTone(level.slug);

  return (
    <section id={id} className={cn(id && "scroll-mt-24")}>
      <div className="flex items-baseline gap-2">
        <span
          className={cn("h-4 w-1 rounded-full", tone.bar)}
          aria-hidden
        />
        <h3 className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          <span aria-hidden>{level.emoji}</span>
          {level.label}
        </h3>
        <span className="tabular-nums text-xs text-muted-foreground">
          {lessons.length}件
        </span>
        {showBlurb && (
          <span className="ml-1 hidden text-xs text-muted-foreground sm:inline">
            — {level.blurb}
          </span>
        )}
      </div>

      <ul className="mt-2.5 space-y-1.5">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <LessonRow {...lesson} />
          </li>
        ))}
      </ul>
    </section>
  );
}
