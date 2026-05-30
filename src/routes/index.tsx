import { createFileRoute, Link } from "@tanstack/react-router";
import { ArticleCard } from "@/components/ArticleCard";
import { RssNewsBox } from "@/components/RssNewsBox";
import { AdBanner } from "@/components/AdBanner";
import { CATEGORIES } from "@/lib/data";
import { useArticles } from "@/lib/articles-store";
import { useI18n } from "@/lib/i18n";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pest Megyei Hírlap — Friss hírek Pest megyéből" },
      { name: "description", content: "Hírek Pest megye városaiból: gazdaság, kultúra, közélet, sport, turizmus." },
    ],
  }),
  component: Index,
});

function Index() {
  const { lang, t } = useI18n();
  const sorted = useArticles();
  const [featured, ...rest] = sorted;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 border-l-4 border-accent pl-4">
        <h1 className="font-serif text-3xl md:text-4xl font-bold">{t("latest")}</h1>
        <p className="text-muted-foreground mt-1">{t("tagline")}</p>
      </div>

      <AdBanner placement="home" size="leaderboard" className="mb-8" />


      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="min-w-0">
          {featured && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <ArticleCard article={featured} featured />
              </div>
              {rest.slice(0, 4).map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}

          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold mb-6 border-b pb-3">{t("categories")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to="/kategoria/$slug"
                  params={{ slug: cat.slug }}
                  className="block p-6 bg-card border rounded-md text-center hover:border-accent hover:shadow-md transition-all"
                >
                  <span className="font-serif font-bold text-lg">
                    {lang === "hu" ? cat.hu : cat.en}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {rest.length > 4 && (
            <section className="mt-16">
              <h2 className="font-serif text-2xl font-bold mb-6 border-b pb-3">{t("latest")}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {rest.slice(4).map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <RssNewsBox />
          <AdBanner placement="home" size="rectangle" />
        </div>

      </div>
    </div>
  );
}
