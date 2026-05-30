import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { addSubmission, type Submission } from "@/lib/submissions-store";

interface Props {
  kind: Submission["kind"];
  submitLabel: string;
}

export function SubmissionForm({ kind, submitLabel }: Props) {
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [ok, setOk] = useState(false);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body || !author) return;
    addSubmission({
      id: `s-${Date.now()}`,
      kind,
      title,
      body,
      author,
      contact: contact || undefined,
      city: city || undefined,
      date: new Date().toISOString(),
    });
    setTitle(""); setBody(""); setAuthor(""); setContact(""); setCity("");
    setOk(true);
    setTimeout(() => setOk(false), 4000);
  };

  return (
    <form onSubmit={handle} className="bg-card border rounded-md p-6 space-y-3">
      <h2 className="font-serif text-xl font-bold border-b pb-2">{submitLabel}</h2>
      <Input placeholder={t("titleField")} value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Textarea placeholder={t("bodyField")} rows={5} value={body} onChange={(e) => setBody(e.target.value)} required />
      <div className="grid md:grid-cols-3 gap-3">
        <Input placeholder={t("authorField")} value={author} onChange={(e) => setAuthor(e.target.value)} required />
        <Input placeholder={t("contactField")} value={contact} onChange={(e) => setContact(e.target.value)} />
        <Input placeholder={t("cityField")} value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div className="flex items-center gap-3 pt-1">
        <Button type="submit">{t("submit")}</Button>
        {ok && <span className="text-sm text-accent font-medium">✓ {t("pendingReview")}</span>}
      </div>
      <p className="text-xs text-muted-foreground border-t pt-2">{t("moderationNotice")}</p>
    </form>
  );
}
