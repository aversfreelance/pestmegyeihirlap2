import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, slugifyCity } from "@/lib/data";
import { useArticles } from "@/lib/articles-store";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/cikk/$id")({
  component: ArticlePage,
  notFoundComponent: () => <div className="container mx-auto px-4 py-16">Cikk nem található.</div>,
  errorComponent: () => <div className="container mx-auto px-4 py-16">Hiba történt.</div>,
});

function ArticlePage() {
  const { id } = Route.useParams();
  const { lang, t } = useI18n();
  const article = useArticles().find((a) => a.id === id);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Cikk nem található.</p>
        <Link to="/" className="mt-4 inline-block text-accent underline">{t("backHome")}</Link>
      </div>
    );
  }

  const cat = CATEGORIES.find((c) => c.slug === article.category)!;
  const title = lang === "hu" ? article.titleHu : article.titleEn;
  const body = lang === "hu" ? article.bodyHu : article.bodyEn;
  const excerpt = lang === "hu" ? article.excerptHu : article.excerptEn;

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex items-center gap-3 text-sm">
        <Link to="/kategoria/$slug" params={{ slug: cat.slug }} className="text-accent font-semibold uppercase tracking-wider text-xs">
          {lang === "hu" ? cat.hu : cat.en}
        </Link>
        <span className="text-muted-foreground">·</span>
        <Link to="/varos/$slug" params={{ slug: slugifyCity(article.city) }} className="text-muted-foreground hover:text-foreground">
          {article.city}
        </Link>
      </div>

      <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight">{title}</h1>
      <p className="mt-4 text-xl text-muted-foreground font-serif italic">{excerpt}</p>

      <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground border-y py-3">
        <span>{article.author}</span>
        <span>{article.date}</span>
      </div>

      {article.image && (
        <img src={article.image} alt={title} className="w-full aspect-[16/9] object-cover rounded-md mt-6" />
      )}

      <div className="mt-8 text-lg leading-relaxed whitespace-pre-line">{body}</div>

      <Link to="/" className="mt-12 inline-block text-accent font-semibold hover:underline">
        ← {t("backHome")}
      </Link>
    </article>
  );
}
