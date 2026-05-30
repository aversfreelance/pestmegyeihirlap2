import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  source?: string;
}

function decode(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function pick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? decode(m[1]) : "";
}

export const fetchRss = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      url: z.string().url().optional(),
      limit: z.number().min(1).max(30).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const url = data.url ?? "https://telex.hu/rss";
    const limit = data.limit ?? 10;

    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 PestMegyeiHirlap/1.0",
          Accept: "application/rss+xml, application/xml, text/xml, */*",
        },
      });
      if (!res.ok) {
        return { items: [] as RssItem[], error: `HTTP ${res.status}` };
      }
      const xml = await res.text();
      const channelTitle = pick(xml, "title");
      const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
      const items: RssItem[] = itemBlocks.slice(0, limit).map((b) => ({
        title: pick(b, "title"),
        link: pick(b, "link"),
        pubDate: pick(b, "pubDate") || pick(b, "dc:date"),
        source: channelTitle,
      }));
      return { items, error: null as string | null };
    } catch (e) {
      return { items: [] as RssItem[], error: (e as Error).message };
    }
  });
