import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, type Article } from "@/lib/data";

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const { lang, t } = useI18n();
  const cat = CATEGORIES.find((c) => c.slug === article.category)!;
  const title = lang === "hu" ? article.titleHu : article.titleEn;
  const excerpt = lang === "hu" ? article.excerptHu : article.excerptEn;

  return (
    <article
      className={`group bg-card border rounded-md overflow-hidden hover:shadow-lg transition-all ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <Link to="/cikk/$id" params={{ id: article.id }} className="block">
        <div className={`overflow-hidden ${featured ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
          <img
            src={article.image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider mb-3">
            <span className="text-accent font-semibold">
              {lang === "hu" ? cat.hu : cat.en}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{article.city}</span>
          </div>
          <h3
            className={`font-serif font-bold leading-tight group-hover:text-accent transition-colors ${
              featured ? "text-2xl md:text-3xl" : "text-lg"
            }`}
          >
            {title}
          </h3>
          <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>{article.author}</span>
            <span>{article.date}</span>
          </div>
          <div className="mt-3 text-sm font-semibold text-accent">
            {t("readMore")} →
          </div>
        </div>
      </Link>
    </article>
  );
}
