import { createFileRoute, Link } from "@tanstack/react-router";
import { SubmissionForm } from "@/components/SubmissionForm";
import { AdBanner } from "@/components/AdBanner";
import { useApprovedSubmissions } from "@/lib/submissions-store";
import { useSettings } from "@/lib/settings-store";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/aprohirdetesek")({
  head: () => ({
    meta: [
      { title: "Apróhirdetések — Pest Megyei Hírlap" },
      { name: "description", content: "Apróhirdetések Pest megyéből." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const items = useApprovedSubmissions("classified");
  const { showClassifieds } = useSettings();

  if (!showClassifieds) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">A szekció jelenleg nem elérhető.</p>
        <Link to="/" className="text-accent underline mt-3 inline-block">{t("backHome")}</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 border-l-4 border-accent pl-4">
        <h1 className="font-serif text-3xl md:text-4xl font-bold">{t("classifieds")}</h1>
      </div>

      <AdBanner placement="classifieds" size="leaderboard" className="mb-8" />

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-4">
          {items.length === 0 && (
            <p className="text-muted-foreground bg-card border rounded-md p-6">{t("noEntries")}</p>
          )}
          {items.map((s) => (
            <article key={s.id} className="bg-card border rounded-md p-5">
              <h2 className="font-serif text-xl font-bold">{s.title}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(s.date).toLocaleDateString("hu-HU")} · {s.author}
                {s.city ? ` · ${s.city}` : ""}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{s.body}</p>
              {s.contact && (
                <p className="mt-3 text-sm font-medium text-accent">{s.contact}</p>
              )}
            </article>
          ))}
        </div>

        <div className="space-y-6">
          <SubmissionForm kind="classified" submitLabel={t("submitClassified")} />
          <AdBanner placement="classifieds" size="rectangle" />
        </div>
      </div>
    </div>
  );
}
