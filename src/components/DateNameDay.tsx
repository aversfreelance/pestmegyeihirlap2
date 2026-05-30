import { useEffect, useState } from "react";
import { CalendarDays, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { NAME_DAYS, HOLIDAYS, getKey } from "@/lib/name-days";

export function DateNameDay() {
  const { lang } = useI18n();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  if (!now) return null;

  const key = getKey(now);
  const nameDay = NAME_DAYS[key];
  const holiday = HOLIDAYS[key];

  const dateStr = now.toLocaleDateString(lang === "hu" ? "hu-HU" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="hidden md:flex flex-col items-end text-right text-xs leading-tight">
      <div className="flex items-center gap-1.5 font-medium text-foreground">
        <CalendarDays className="h-3.5 w-3.5 text-accent" />
        <span className="capitalize">{dateStr}</span>
      </div>
      {nameDay && (
        <div className="text-muted-foreground mt-0.5">
          {lang === "hu" ? "Névnap" : "Name day"}: <span className="font-medium text-foreground">{nameDay}</span>
        </div>
      )}
      {holiday && (
        <div className="flex items-center gap-1 mt-0.5 text-accent font-medium">
          <Sparkles className="h-3 w-3" />
          <span>{lang === "hu" ? holiday.hu : holiday.en}</span>
        </div>
      )}
    </div>
  );
}
