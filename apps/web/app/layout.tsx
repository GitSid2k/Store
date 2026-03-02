import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { CustomCursor } from "@/components/ui/cursor";
import { SiteNav } from "@/components/ui/site-nav";
import { SiteFooter } from "@/components/ui/site-footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { SmoothScroll } from "@/components/animations/smooth-scroll";
import { PostHogProvider, PostHogPageview } from "@/lib/posthog";
import { Suspense } from "react";
import "../styles/globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});
const body = Jost({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Дуб & Сталь", template: "%s — Дуб & Сталь" },
  description: "Авторская мебель из массива дерева и кованого металла. Дуб, орех, латунь, чернёная сталь — ручная работа, Подмосковье.",
  keywords: ["мебель", "дизайнерская мебель", "дуб", "сталь", "авторская мебель", "металлический декор", "мебель ручной работы"],
  authors: [{ name: "Дуб & Сталь", url: "https://dubstal.ru" }],
  metadataBase: new URL("https://dubstal.ru"),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://dubstal.ru",
    siteName: "Дуб & Сталь",
    title: "Дуб & Сталь — Авторская мебель",
    description: "Авторская мебель из массива дерева и кованого металла.",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Дуб & Сталь" }],
  },
  twitter: { card: "summary_large_image", title: "Дуб & Сталь", description: "Авторская мебель из массива дерева и кованого металла." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body style={{ fontFamily: "var(--font-body)" }}>
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageview />
          </Suspense>
          <SmoothScroll />
          <CustomCursor />

          <SiteNav />

          {children}

          <SiteFooter />
          <ScrollToTop />
        </PostHogProvider>
      </body>
    </html>
  );
}
