import { Link } from "@tanstack/react-router";
import { Radio } from "lucide-react";
import { useArticles } from "@/lib/articles-store";
import { useI18n } from "@/lib/i18n";

export function NewsTicker() {
  const { lang, t } = useI18n();
  const articles = useArticles().slice(0, 10);

  if (articles.length === 0) return null;

  // Duplicate the list so the marquee loops seamlessly
  const loop = [...articles, ...articles];

  return (
    <div className="border-b bg-card text-card-foreground overflow-hidden">
      <div className="container mx-auto flex items-stretch px-0">
        <div className="flex items-center gap-1.5 bg-[var(--gold)] text-primary px-3 py-1.5 shrink-0">
          <Radio className="h-3.5 w-3.5 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {t("breaking")}
          </span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker-track flex gap-8 whitespace-nowrap py-1.5 text-sm">
            {loop.map((a, i) => (
              <Link
                key={`${a.id}-${i}`}
                to="/cikk/$id"
                params={{ id: a.id }}
                className="hover:text-accent transition-colors inline-flex items-center gap-2"
              >
                <span className="text-[var(--gold)]">●</span>
                <span className="font-medium">
                  {lang === "hu" ? a.titleHu : a.titleEn}
                </span>
                <span className="text-muted-foreground text-xs">— {a.city}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
