import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground font-serif">404</h1>
        <p className="mt-4 text-muted-foreground">Az oldal nem található.</p>
        <Link to="/" className="mt-6 inline-block underline">Vissza a főoldalra</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Hiba történt</h1>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Újrapróbálom
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pest Megyei Hírlap" },
      { name: "description", content: "Friss hírek Pest megyéből: gazdaság, kultúra, közélet, sport, turizmus." },
      { property: "og:title", content: "Pest Megyei Hírlap" },
      { name: "twitter:title", content: "Pest Megyei Hírlap" },
      { property: "og:description", content: "Friss hírek Pest megyéből: gazdaság, kultúra, közélet, sport, turizmus." },
      { name: "twitter:description", content: "Friss hírek Pest megyéből: gazdaság, kultúra, közélet, sport, turizmus." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/EfJ2BWRJkAdRM69ZzcbfNQ3Wicb2/social-images/social-1780039001131-ChatGPT_Image_May_29,_2026,_08_13_59_AM.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/EfJ2BWRJkAdRM69ZzcbfNQ3Wicb2/social-images/social-1780039001131-ChatGPT_Image_May_29,_2026,_08_13_59_AM.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <div className="min-h-screen flex flex-col">
            <SiteHeader />
            <main className="flex-1">
              <Outlet />
            </main>
            <SiteFooter />
          </div>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
