import { useSyncExternalStore } from "react";

export interface Submission {
  id: string;
  kind: "classified" | "letter";
  title: string;
  body: string;
  author: string;
  contact?: string;
  city?: string;
  date: string;
  approved: boolean;
}

const KEY = "pm_submissions_v2";
const LEGACY_KEY = "pm_submissions_v1";

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

function read(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Submission[];
    // Migrate legacy entries — treat them as pending (not approved).
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const arr = (JSON.parse(legacy) as Omit<Submission, "approved">[]).map((s) => ({
        ...s,
        approved: false,
      }));
      localStorage.setItem(KEY, JSON.stringify(arr));
      return arr;
    }
    return [];
  } catch {
    return [];
  }
}

let cache: Submission[] | null = null;
const snap = (): Submission[] => cache ?? (cache = read());
const serverSnap = (): Submission[] => [];

function persist(next: Submission[]) {
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  emit();
}

export function useSubmissions(kind?: Submission["kind"]): Submission[] {
  const all = useSyncExternalStore(subscribe, snap, serverSnap);
  return kind ? all.filter((s) => s.kind === kind) : all;
}

export function useApprovedSubmissions(kind: Submission["kind"]): Submission[] {
  return useSubmissions(kind).filter((s) => s.approved);
}

export function addSubmission(s: Omit<Submission, "approved"> & { approved?: boolean }) {
  persist([{ ...s, approved: s.approved ?? false }, ...snap()]);
}

export function deleteSubmission(id: string) {
  persist(snap().filter((s) => s.id !== id));
}

export function approveSubmission(id: string) {
  persist(snap().map((s) => (s.id === id ? { ...s, approved: true } : s)));
}

export function unapproveSubmission(id: string) {
  persist(snap().map((s) => (s.id === id ? { ...s, approved: false } : s)));
}
