import { useSyncExternalStore } from "react";

const KEY = "pm_settings_v2";

export type AdPlacement = "home" | "category" | "classifieds" | "letters";

export interface SiteSettings {
  showClassifieds: boolean;
  showLetters: boolean;
  ads: Record<AdPlacement, boolean>;
}

const DEFAULTS: SiteSettings = {
  showClassifieds: true,
  showLetters: true,
  ads: {
    home: true,
    category: true,
    classifieds: true,
    letters: true,
  },
};

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
};
const emit = () => listeners.forEach((l) => l());

function read(): SiteSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return {
      ...DEFAULTS,
      ...parsed,
      ads: { ...DEFAULTS.ads, ...(parsed.ads ?? {}) },
    };
  } catch {
    return DEFAULTS;
  }
}

let cache: SiteSettings | null = null;
function snapshot(): SiteSettings {
  return cache ?? (cache = read());
}
function serverSnapshot(): SiteSettings {
  return DEFAULTS;
}

export function useSettings(): SiteSettings {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}

export function updateSettings(patch: Partial<Omit<SiteSettings, "ads">>) {
  const next = { ...snapshot(), ...patch };
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  emit();
}

export function updateAdPlacement(p: AdPlacement, value: boolean) {
  const cur = snapshot();
  const next: SiteSettings = { ...cur, ads: { ...cur.ads, [p]: value } };
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  emit();
}
