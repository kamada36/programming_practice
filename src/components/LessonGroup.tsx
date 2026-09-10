import { levelTone } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { LevelMeta } from "@/types/recipe";
import { LessonRow, type LessonRowData } from "@/components/LessonRow";

interface LessonGroupProps {
  level: LevelMeta;
  lessons: LessonRowData[];
  /** アンカー用 id。 */
  id?: string;
}

/** 難易度見出し + その難易度のメニュー行リスト。 */
export function LessonGroup({ level, lessons, id }: LessonGroupProps) {
  if (lessons.length === 0) return null;
  const tone = levelTone(level.slug);

  return (
    <section id={id} className={cn("max-w-md", id && "scroll-mt-24")}>
      <div className="flex items-center gap-2">
        <span className={cn("h-3.5 w-1 rounded-full", tone.bar)} aria-hidden />
        <h3 className="text-sm font-bold text-foreground">
          <span aria-hidden>{level.emoji}</span> {level.label}
        </h3>
        <span className="tabular-nums text-xs text-muted-foreground">
          {lessons.length}
        </span>
      </div>

      <ul className="mt-2 space-y-1.5">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <LessonRow {...lesson} />
          </li>
        ))}
      </ul>
    </section>
  );
}
