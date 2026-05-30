import { createFileRoute, Link } from "@tanstack/react-router";
import { AdBanner } from "@/components/AdBanner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/kozgyules")({
  head: () => ({
    meta: [
      { title: "Pest Megyei Közgyűlés hírei — Pest Megyei Hírlap" },
      { name: "description", content: "Hírek és közlemények a Pest Megyei Közgyűlésről." },
      { property: "og:title", content: "Pest Megyei Közgyűlés hírei" },
      { property: "og:description", content: "Hírek és közlemények a Pest Megyei Közgyűlésről." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 border-l-4 border-accent pl-4">
        <h1 className="font-serif text-3xl md:text-4xl font-bold">
          Pest Megyei Közgyűlés hírei
        </h1>
        <p className="text-muted-foreground mt-1">
          Friss közlemények, ülésnapirendek és döntések a Pest Megyei Közgyűlésről.
        </p>
      </div>

      <AdBanner placement="home" size="leaderboard" className="mb-8" />

      <div className="bg-card border rounded-md p-8 text-center">
        <p className="text-muted-foreground">
          Hamarosan itt olvashatja a Pest Megyei Közgyűlés legfrissebb híreit.
        </p>
        <Link to="/" className="text-accent underline mt-3 inline-block">
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
