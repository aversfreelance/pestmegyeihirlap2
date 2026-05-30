import { useEffect, useState, useSyncExternalStore } from "react";
import { ARTICLES, type Article } from "./data";

const KEY = "pm_articles_v1";

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
};
const emit = () => listeners.forEach((l) => l());

function readStored(): Article[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Article[]) : [];
  } catch {
    return [];
  }
}

let cache: Article[] | null = null;
let mergedCache: Article[] | null = null;

function getSnapshot(): Article[] {
  const stored = cache ?? (cache = readStored());
  if (!mergedCache) {
    mergedCache = [...stored, ...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
  }
  return mergedCache;
}

function getServerSnapshot(): Article[] {
  return ARTICLES;
}

export function useArticles(): Article[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function addArticle(a: Article) {
  const stored = readStored();
  const next = [a, ...stored];
  localStorage.setItem(KEY, JSON.stringify(next));
  cache = next;
  mergedCache = null;
  emit();
}

export function deleteArticle(id: string) {
  const stored = readStored().filter((a) => a.id !== id);
  localStorage.setItem(KEY, JSON.stringify(stored));
  cache = stored;
  mergedCache = null;
  emit();
}

export function getStoredArticles(): Article[] {
  // Hook variant for components that only need the user-created list
  return cache ?? (cache = readStored());
}

export function useStoredArticles(): Article[] {
  const [list, setList] = useState<Article[]>(() => (typeof window === "undefined" ? [] : readStored()));
  useEffect(() => {
    const update = () => setList(readStored());
    update();
    return subscribe(update);
  }, []);
  return list;
}
