import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Rss, ExternalLink } from "lucide-react";
import { fetchRss, type RssItem } from "@/lib/rss.functions";
import { useI18n } from "@/lib/i18n";

interface Props {
  url?: string;
  title?: string;
}

export function RssNewsBox({ url, title }: Props) {
  const { t } = useI18n();
  const call = useServerFn(fetchRss);
  const [items, setItems] = useState<RssItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sourceTitle, setSourceTitle] = useState<string>("");

  useEffect(() => {
    let active = true;
    setItems(null);
    setError(null);
    call({ data: { url, limit: 8 } })
      .then((res) => {
        if (!active) return;
        setItems(res.items);
        if (res.error) setError(res.error);
        if (res.items[0]?.source) setSourceTitle(res.items[0].source);
      })
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [url, call]);

  return (
    <aside className="bg-card border rounded-md overflow-hidden sticky top-32">
      <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2">
        <Rss className="h-4 w-4 text-[var(--gold)]" />
        <h3 className="font-serif font-bold">
          {title ?? t("rssBoxTitle")}
        </h3>
      </div>

      {sourceTitle && (
        <div className="px-4 py-2 text-[11px] uppercase tracking-wider text-muted-foreground border-b bg-muted/40">
          {t("source")}: {sourceTitle}
        </div>
      )}

      {!items && !error && (
        <ul className="divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="p-4 space-y-2 animate-pulse">
              <div className="h-3 w-3/4 bg-muted rounded" />
              <div className="h-2 w-1/3 bg-muted rounded" />
            </li>
          ))}
        </ul>
      )}

      {error && !items?.length && (
        <div className="p-4 text-sm text-muted-foreground">
          {t("rssError")}
        </div>
      )}

      {items && items.length > 0 && (
        <ul className="divide-y">
          {items.map((it, i) => (
            <li key={i} className="hover:bg-muted/40 transition-colors">
              <a
                href={it.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 group"
              >
                <div className="text-sm font-medium leading-snug group-hover:text-accent flex items-start gap-1.5">
                  <span className="flex-1">{it.title}</span>
                  <ExternalLink className="h-3 w-3 mt-1 shrink-0 opacity-50 group-hover:opacity-100" />
                </div>
                {it.pubDate && (
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {new Date(it.pubDate).toLocaleString("hu-HU", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
