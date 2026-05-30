import { createFileRoute, notFound } from "@tanstack/react-router";
import { CATEGORIES, type CategorySlug } from "@/lib/data";
import { useArticles } from "@/lib/articles-store";
import { ArticleCard } from "@/components/ArticleCard";
import { AdBanner } from "@/components/AdBanner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/kategoria/$slug")({
  loader: ({ params }) => {
    const cat = CATEGORIES.find((c) => c.slug === params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  component: CategoryPage,
  notFoundComponent: () => <div className="container mx-auto px-4 py-16">Kategória nem található.</div>,
  errorComponent: () => <div className="container mx-auto px-4 py-16">Hiba történt.</div>,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { lang, t } = useI18n();
  const cat = CATEGORIES.find((c) => c.slug === (slug as CategorySlug))!;
  const articles = useArticles().filter((a) => a.category === slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 border-l-4 border-accent pl-4">
        <div className="text-xs uppercase tracking-widest text-accent font-semibold">{t("categories")}</div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mt-1">
          {lang === "hu" ? cat.hu : cat.en}
        </h1>
      </div>

      <AdBanner placement="category" size="leaderboard" className="mb-6" />

      {articles.length === 0 ? (
        <p className="text-muted-foreground">{t("noArticles")}</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
