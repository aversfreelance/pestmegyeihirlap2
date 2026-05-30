import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CATEGORIES, CITIES, type CategorySlug, type Article } from "@/lib/data";
import { useArticles, addArticle, deleteArticle, useStoredArticles } from "@/lib/articles-store";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Lock, Trash2, Plus } from "lucide-react";
import { useSettings, updateSettings, updateAdPlacement, type AdPlacement } from "@/lib/settings-store";
import { useSubmissions, deleteSubmission, approveSubmission, unapproveSubmission } from "@/lib/submissions-store";


const DEMO_PASSWORD = "admin123";
const AUTH_KEY = "pm_admin_auth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Pest Megyei Hírlap" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { t } = useI18n();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setAuthed(sessionStorage.getItem(AUTH_KEY) === "1");
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEMO_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      setAuthed(true);
      setError("");
    } else {
      setError(t("wrongPassword"));
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    setPassword("");
    navigate({ to: "/" });
  };

  if (!authed) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="bg-card border rounded-md p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary text-primary-foreground rounded">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="font-serif text-2xl font-bold">{t("adminLoginTitle")}</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t("password")}</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">{t("login")}</Button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground border-t pt-4">
            {t("demoNotice")}
          </p>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { lang, t } = useI18n();
  const all = useArticles();
  const userCreated = useStoredArticles();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h1 className="font-serif text-3xl font-bold">{t("adminTitle")}</h1>
        <Button variant="outline" onClick={onLogout}>{t("logout")}</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <NewArticleForm />

          <div className="bg-card border rounded-md mt-8">
            <div className="p-4 border-b font-semibold">{t("recentArticles")} ({all.length})</div>
            <ul className="divide-y">
              {all.map((a) => {
                const isUserCreated = userCreated.some((u) => u.id === a.id);
                return (
                  <li key={a.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">
                        {lang === "hu" ? a.titleHu : a.titleEn}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {a.city} · {a.date} · {a.author}
                      </div>
                    </div>
                    <span className="text-xs uppercase tracking-wider text-accent font-semibold whitespace-nowrap">
                      {CATEGORIES.find((c) => c.slug === a.category)?.[lang]}
                    </span>
                    {isUserCreated && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Biztos törlöd?")) deleteArticle(a.id);
                        }}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <SubmissionsManager />
        </div>


        <aside className="space-y-4">
          <SettingsPanel />

          <div className="bg-card border rounded-md p-6">

            <div className="font-serif text-4xl font-bold mt-2">{all.length}</div>
          </div>
          <div className="bg-card border rounded-md p-6">
            <div className="text-sm text-muted-foreground mb-3">{t("byCategory")}</div>
            <ul className="space-y-2">
              {CATEGORIES.map((c) => (
                <li key={c.slug} className="flex justify-between text-sm">
                  <span>{lang === "hu" ? c.hu : c.en}</span>
                  <span className="font-semibold">
                    {all.filter((a) => a.category === c.slug).length}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-muted-foreground">{t("demoNotice")}</p>
        </aside>
      </div>
    </div>
  );
}

function NewArticleForm() {
  const { t } = useI18n();
  const [titleHu, setTitleHu] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [excerptHu, setExcerptHu] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [bodyHu, setBodyHu] = useState("");
  const [bodyEn, setBodyEn] = useState("");
  const [category, setCategory] = useState<CategorySlug>("kozelet");
  const [city, setCity] = useState<string>("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleHu || !city || !author) return;

    const article: Article = {
      id: `u-${Date.now()}`,
      titleHu,
      titleEn: titleEn || titleHu,
      excerptHu,
      excerptEn: excerptEn || excerptHu,
      bodyHu,
      bodyEn: bodyEn || bodyHu,
      category,
      city,
      author,
      date: new Date().toISOString().slice(0, 10),
      image:
        image ||
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80&auto=format&fit=crop",
    };

    addArticle(article);

    setTitleHu(""); setTitleEn(""); setExcerptHu(""); setExcerptEn("");
    setBodyHu(""); setBodyEn(""); setAuthor(""); setImage("");
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border rounded-md p-6 space-y-4">
      <div className="flex items-center gap-2 border-b pb-3">
        <Plus className="h-5 w-5 text-accent" />
        <h2 className="font-serif text-xl font-bold">{t("newArticle")}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label={`${t("titleField")} (HU)`} required>
          <Input value={titleHu} onChange={(e) => setTitleHu(e.target.value)} required />
        </Field>
        <Field label={`${t("titleField")} (EN)`}>
          <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
        </Field>

        <Field label={`${t("excerptField")} (HU)`}>
          <Input value={excerptHu} onChange={(e) => setExcerptHu(e.target.value)} />
        </Field>
        <Field label={`${t("excerptField")} (EN)`}>
          <Input value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} />
        </Field>
      </div>

      <Field label={`${t("bodyField")} (HU)`}>
        <Textarea value={bodyHu} onChange={(e) => setBodyHu(e.target.value)} rows={4} />
      </Field>
      <Field label={`${t("bodyField")} (EN)`}>
        <Textarea value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} rows={4} />
      </Field>

      <div className="grid md:grid-cols-3 gap-4">
        <Field label={t("categoryField")} required>
          <Select value={category} onValueChange={(v) => setCategory(v as CategorySlug)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>{c.hu}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label={t("cityField")} required>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger>
              <SelectValue placeholder={t("selectCity")} />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label={t("authorField")} required>
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </Field>
      </div>

      <Field label={t("imageField")}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 4 * 1024 * 1024) {
                  alert("Max 4 MB");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => setImage(String(reader.result));
                reader.readAsDataURL(file);
              }}
              className="cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-primary file:text-primary-foreground file:px-3 file:py-1 file:text-sm"
            />
          </div>
          <div className="text-xs text-muted-foreground">{t("orImageUrl")}</div>
          <Input
            value={image.startsWith("data:") ? "" : image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
          />
          {image && (
            <div className="mt-2">
              <img
                src={image}
                alt="preview"
                className="h-32 w-full object-cover rounded border"
              />
            </div>
          )}
        </div>
      </Field>

      <div className="flex items-center gap-4 pt-2">
        <Button type="submit">{t("saveArticle")}</Button>
        {saved && <span className="text-sm text-accent font-medium">✓ {t("savedOk")}</span>}
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

function SettingsPanel() {
  const { t } = useI18n();
  const s = useSettings();
  const Row = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );

  const adRows: { key: AdPlacement; label: string }[] = [
    { key: "home", label: t("adHome") },
    { key: "category", label: t("adCategory") },
    { key: "classifieds", label: t("adClassifieds") },
    { key: "letters", label: t("adLetters") },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-card border rounded-md p-6">
        <div className="text-sm font-semibold mb-2">{t("visibleSections")}</div>
        <Row label={t("showClassifieds")} value={s.showClassifieds} onChange={(v) => updateSettings({ showClassifieds: v })} />
        <Row label={t("showLetters")} value={s.showLetters} onChange={(v) => updateSettings({ showLetters: v })} />
      </div>
      <div className="bg-card border rounded-md p-6">
        <div className="text-sm font-semibold mb-2">{t("adPlacements")}</div>
        {adRows.map((r) => (
          <Row
            key={r.key}
            label={r.label}
            value={s.ads[r.key]}
            onChange={(v) => updateAdPlacement(r.key, v)}
          />
        ))}
      </div>
    </div>
  );
}

function SubmissionsManager() {
  const { t } = useI18n();
  const classifieds = useSubmissions("classified");
  const letters = useSubmissions("letter");

  const Section = ({ title, items }: { title: string; items: ReturnType<typeof useSubmissions> }) => {
    const pending = items.filter((s) => !s.approved);
    const approved = items.filter((s) => s.approved);
    const Row = (s: typeof items[number]) => (
      <li key={s.id} className="p-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{s.title}</span>
            <span
              className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                s.approved
                  ? "bg-accent/15 text-accent"
                  : "bg-destructive/15 text-destructive"
              }`}
            >
              {s.approved ? t("approved") : t("pending")}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {new Date(s.date).toLocaleDateString("hu-HU")} · {s.author}
            {s.city ? ` · ${s.city}` : ""}
          </div>
          <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">{s.body}</p>
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          {s.approved ? (
            <Button variant="outline" size="sm" onClick={() => unapproveSubmission(s.id)}>
              {t("unapprove")}
            </Button>
          ) : (
            <Button size="sm" onClick={() => approveSubmission(s.id)}>
              {t("approve")}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("Biztos törlöd?")) deleteSubmission(s.id);
            }}
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </li>
    );

    return (
      <div className="bg-card border rounded-md mt-8">
        <div className="p-4 border-b font-semibold flex justify-between items-center">
          <span>{title}</span>
          <span className="text-muted-foreground text-sm">
            {pending.length} {t("pending").toLowerCase()} · {approved.length} {t("approved").toLowerCase()}
          </span>
        </div>
        {items.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">{t("noEntries")}</div>
        ) : (
          <ul className="divide-y">
            {pending.map(Row)}
            {approved.map(Row)}
          </ul>
        )}
      </div>
    );
  };

  return (
    <>
      <Section title={t("classifieds")} items={classifieds} />
      <Section title={t("letters")} items={letters} />
    </>
  );
}

