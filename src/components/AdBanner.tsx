import { useSettings, type AdPlacement } from "@/lib/settings-store";
import { useI18n } from "@/lib/i18n";

interface Props {
  /** Which page placement this banner belongs to */
  placement: AdPlacement;
  /** Banner size preset */
  size?: "leaderboard" | "rectangle" | "skyscraper";
  /** Custom label or sponsor text */
  label?: string;
  className?: string;
}

const SIZES = {
  leaderboard: "h-24 md:h-28",
  rectangle: "h-48 md:h-56",
  skyscraper: "h-[600px]",
};

export function AdBanner({ placement, size = "leaderboard", label, className = "" }: Props) {
  const { ads } = useSettings();
  const { t } = useI18n();
  if (!ads[placement]) return null;

  return (
    <div
      className={`relative ${SIZES[size]} w-full rounded-md border border-dashed bg-muted/50 flex items-center justify-center overflow-hidden ${className}`}
      aria-label="advertisement"
    >
      <div className="absolute top-1 left-2 text-[10px] uppercase tracking-widest text-muted-foreground">
        {t("advertisement")}
      </div>
      <div className="text-center text-muted-foreground">
        <div className="font-serif text-lg md:text-xl">{label ?? t("yourAdHere")}</div>
        <div className="text-xs mt-1">
          {size === "leaderboard" ? "728 × 90" : size === "rectangle" ? "300 × 250" : "160 × 600"}
        </div>
      </div>
    </div>
  );
}
