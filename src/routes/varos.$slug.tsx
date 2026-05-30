import { createFileRoute, notFound } from "@tanstack/react-router";
import { CITIES, slugifyCity } from "@/lib/data";
import { useArticles } from "@/lib/articles-store";
import { ArticleCard } from "@/components/ArticleCard";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/varos/$slug")({
  loader: ({ params }) => {
    const city = CITIES.find((c) => slugifyCity(c) === params.slug);
    if (!city) throw notFound();
    return { city };
  },
  component: CityPage,
  notFoundComponent: () => <div className="container mx-auto px-4 py-16">Város nem található.</div>,
  errorComponent: () => <div className="container mx-auto px-4 py-16">Hiba történt.</div>,
});

function CityPage() {
  const { slug } = Route.useParams();
  const { t } = useI18n();
  const city = CITIES.find((c) => slugifyCity(c) === slug)!;
  const articles = useArticles().filter((a) => a.city === city);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 border-l-4 border-accent pl-4">
        <div className="text-xs uppercase tracking-widest text-accent font-semibold">{t("cities")}</div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mt-1">{city}</h1>
        <p className="text-muted-foreground mt-1">
          {articles.length} {t("fromCity")}
        </p>
      </div>

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
