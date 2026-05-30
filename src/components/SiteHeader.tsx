import { Link } from "@tanstack/react-router";
import { Moon, Sun, Menu, ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, CITIES, slugifyCity } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { NewsTicker } from "@/components/NewsTicker";
import { useSettings } from "@/lib/settings-store";
import { DateNameDay } from "@/components/DateNameDay";
import pmhLogo from "@/assets/pmh-logo.png";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useI18n();
  const { showClassifieds, showLetters } = useSettings();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [cityQuery, setCityQuery] = useState("");

  const filteredCities = CITIES.filter((c) =>
    c.toLowerCase().includes(cityQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Top bar */}
      <div className="border-b border-border/60">
        <div className="container mx-auto flex h-9 items-center justify-between px-4 text-xs text-muted-foreground">
          <span>{t("tagline")}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLang("hu")}
              className={`px-2 py-0.5 rounded ${lang === "hu" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              aria-label="Magyar"
            >
              HU
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-0.5 rounded ${lang === "en" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              aria-label="English"
            >
              EN
            </button>
            <button
              onClick={toggle}
              className="ml-2 p-1.5 rounded hover:bg-muted"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main bar + nav + ticker */}
      <div className="container mx-auto flex flex-col md:flex-row items-start gap-4 md:gap-6 px-4 py-4">
        {/* Logo — left side */}
        <Link to="/" className="flex items-center shrink-0" aria-label={t("siteName")}>
          <img
            src={pmhLogo}
            alt={t("siteName")}
            className="h-28 md:h-44 w-auto object-contain"
          />
        </Link>

        {/* Right side: DateNameDay, mobile toggle, nav, ticker */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="flex items-center justify-end gap-4">
            <DateNameDay />
            <button
              className="md:hidden p-2 rounded hover:bg-muted"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Highlighted strip above main nav */}
          <Link
            to="/kozgyules"
            className="block text-center px-5 py-4 text-lg md:text-2xl font-serif font-bold tracking-wide bg-accent text-accent-foreground hover:bg-accent/90 transition-colors rounded-sm shadow-sm"
            activeProps={{ className: "block text-center px-5 py-4 text-lg md:text-2xl font-serif font-bold tracking-wide bg-accent/80 text-accent-foreground rounded-sm shadow-sm" }}
          >
            Pest Megyei Közgyűlés hírei
          </Link>

          {/* Nav */}
          <nav
            className={`${mobileOpen ? "block" : "hidden"} md:block border-t bg-primary text-primary-foreground`}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0 px-4 py-2 md:py-0">
              <Link
                to="/"
                className="px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
                activeProps={{ className: "px-4 py-3 text-sm font-medium bg-accent" }}
                activeOptions={{ exact: true }}
              >
                {t("home")}
              </Link>

              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to="/kategoria/$slug"
                  params={{ slug: cat.slug }}
                  className="px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
                  activeProps={{ className: "px-4 py-3 text-sm font-medium bg-accent" }}
                >
                  {lang === "hu" ? cat.hu : cat.en}
                </Link>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-4 py-3 text-sm font-medium hover:bg-accent transition-colors inline-flex items-center gap-1">
                    {t("cities")} <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="max-h-[70vh] w-72 overflow-y-auto p-0"
                >
                  <div className="sticky top-0 bg-popover border-b p-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder={t("searchCity")}
                        value={cityQuery}
                        onChange={(e) => setCityQuery(e.target.value)}
                        className="pl-7 h-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="py-1 grid grid-cols-2">
                    {filteredCities.map((city) => (
                      <DropdownMenuItem key={city} asChild>
                        <Link
                          to="/varos/$slug"
                          params={{ slug: slugifyCity(city) }}
                          className="cursor-pointer text-sm"
                        >
                          {city}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    {filteredCities.length === 0 && (
                      <div className="col-span-2 px-3 py-4 text-sm text-muted-foreground text-center">
                        {t("notFoundCity")}
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {showClassifieds && (
                <Link
                  to="/aprohirdetesek"
                  className="px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
                  activeProps={{ className: "px-4 py-3 text-sm font-medium bg-accent" }}
                >
                  {t("classifieds")}
                </Link>
              )}
              {showLetters && (
                <Link
                  to="/olvasoi-levelek"
                  className="px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
                  activeProps={{ className: "px-4 py-3 text-sm font-medium bg-accent" }}
                >
                  {t("letters")}
                </Link>
              )}

              <div className="md:ml-auto">
                <Link
                  to="/admin"
                  className="block px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
                >
                  {t("admin")}
                </Link>
              </div>

            </div>
          </nav>
          <NewsTicker />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-8 text-center text-sm">
        {t("footer")}
      </div>
    </footer>
  );
}
