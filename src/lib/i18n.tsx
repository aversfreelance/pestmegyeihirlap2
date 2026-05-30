import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "hu" | "en";

const DICT = {
  siteName: { hu: "Pest Megyei Hírlap", en: "Pest County Herald" },
  tagline: { hu: "Hírek Pest megyéből, naponta", en: "News from Pest County, daily" },
  home: { hu: "Főoldal", en: "Home" },
  categories: { hu: "Rovatok", en: "Categories" },
  cities: { hu: "Városok", en: "Cities" },
  admin: { hu: "Admin", en: "Admin" },
  readMore: { hu: "Tovább", en: "Read more" },
  latest: { hu: "Legfrissebb hírek", en: "Latest news" },
  inCategory: { hu: "rovatban", en: "in category" },
  fromCity: { hu: "város híreiből", en: "from this city" },
  noArticles: { hu: "Nincs még cikk ebben a kategóriában.", en: "No articles in this category yet." },
  backHome: { hu: "Vissza a főoldalra", en: "Back to home" },
  adminTitle: { hu: "Admin felület", en: "Admin panel" },
  adminLoginTitle: { hu: "Admin bejelentkezés", en: "Admin login" },
  password: { hu: "Jelszó", en: "Password" },
  login: { hu: "Belépés", en: "Login" },
  logout: { hu: "Kilépés", en: "Logout" },
  wrongPassword: { hu: "Hibás jelszó", en: "Wrong password" },
  demoNotice: {
    hu: "Demo: a jelszó 'admin123'. Éles használathoz Lovable Cloud authentikáció szükséges.",
    en: "Demo: password is 'admin123'. Production use requires Lovable Cloud authentication.",
  },
  totalArticles: { hu: "Cikkek összesen", en: "Total articles" },
  byCategory: { hu: "Kategóriánként", en: "By category" },
  recentArticles: { hu: "Legutóbbi cikkek", en: "Recent articles" },
  footer: { hu: "© 2026 Pest Megyei Hírlap. Minden jog fenntartva.", en: "© 2026 Pest County Herald. All rights reserved." },
  searchCity: { hu: "Város keresése...", en: "Search city..." },
  notFoundCity: { hu: "Nincs találat.", en: "No results." },
  newArticle: { hu: "Új cikk", en: "New article" },
  titleField: { hu: "Cím", en: "Title" },
  excerptField: { hu: "Bevezető", en: "Excerpt" },
  bodyField: { hu: "Tartalom", en: "Body" },
  categoryField: { hu: "Rovat", en: "Category" },
  cityField: { hu: "Város", en: "City" },
  authorField: { hu: "Szerző", en: "Author" },
  imageField: { hu: "Borítókép URL (opcionális)", en: "Cover image URL (optional)" },
  saveArticle: { hu: "Cikk mentése", en: "Save article" },
  savedOk: { hu: "Cikk mentve és megjelent a főoldalon és a város oldalán.", en: "Article saved and published on home and city pages." },
  delete: { hu: "Törlés", en: "Delete" },
  selectCity: { hu: "Válassz várost", en: "Select city" },
  breaking: { hu: "Friss hírek", en: "Breaking" },
  rssBoxTitle: { hu: "Külső hírek", en: "External news" },
  source: { hu: "Forrás", en: "Source" },
  rssError: { hu: "Nem sikerült betölteni az RSS forrást.", en: "Failed to load RSS feed." },
  rssFeedUrl: { hu: "RSS feed URL", en: "RSS feed URL" },
  imageUpload: { hu: "Kép feltöltése", en: "Upload image" },

  orImageUrl: { hu: "vagy URL", en: "or URL" },
  advertisement: { hu: "Hirdetés", en: "Advertisement" },
  yourAdHere: { hu: "Az Ön hirdetése itt", en: "Your ad here" },
  classifieds: { hu: "Apróhirdetések", en: "Classifieds" },
  letters: { hu: "Olvasói levelek", en: "Letters" },
  submit: { hu: "Beküldés", en: "Submit" },
  submitClassified: { hu: "Apróhirdetés feladása", en: "Post a classified" },
  submitLetter: { hu: "Levél beküldése", en: "Send a letter" },
  noEntries: { hu: "Nincs még bejegyzés.", en: "No entries yet." },
  contactField: { hu: "Elérhetőség (telefon / e-mail)", en: "Contact (phone / email)" },
  settings: { hu: "Beállítások", en: "Settings" },
  visibleSections: { hu: "Megjelenő szekciók", en: "Visible sections" },
  showAds: { hu: "Hirdetés bannerek", en: "Ad banners" },
  showClassifieds: { hu: "Apróhirdetések oldal", en: "Classifieds page" },
  showLetters: { hu: "Olvasói levelek oldal", en: "Letters page" },
  manage: { hu: "Kezelés", en: "Manage" },
  thankYou: { hu: "Köszönjük, közzétettük!", en: "Thank you, published!" },
  pendingReview: { hu: "Köszönjük! Moderálás után jelenik meg.", en: "Thanks! Visible after review." },
  moderationNotice: {
    hu: "A beküldött tartalom csak szerkesztői jóváhagyás után jelenik meg.",
    en: "Submitted content appears only after editor approval.",
  },
  adPlacements: { hu: "Hirdetés helyek", en: "Ad placements" },
  adHome: { hu: "Főoldal", en: "Home page" },
  adCategory: { hu: "Rovat oldalak", en: "Category pages" },
  adClassifieds: { hu: "Apróhirdetések oldal", en: "Classifieds page" },
  adLetters: { hu: "Olvasói levelek oldal", en: "Letters page" },
  pending: { hu: "Jóváhagyásra vár", en: "Pending approval" },
  approved: { hu: "Jóváhagyva", en: "Approved" },
  approve: { hu: "Jóváhagyás", en: "Approve" },
  unapprove: { hu: "Visszavonás", en: "Unapprove" },
} as const;



type Key = keyof typeof DICT;

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("hu");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "hu" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const t = (k: Key) => DICT[k][lang];

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n must be used within I18nProvider");
  return c;
}
