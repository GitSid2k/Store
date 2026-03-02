import Image from "next/image";
import Link from "next/link";
import { HeroParallax } from "@/components/home/hero-parallax";
import { HomeSpotlight } from "@/components/home/spotlight";
import { HorizontalScroll } from "@/components/home/horizontal-scroll";
import { ScrollReveal, ScrollRevealStagger } from "@/components/animations/scroll-reveal";
import { createCaller } from "@/lib/trpc/server";

const materials = [
  {
    title: "Дерево",
    text: "Тонировки дуба, ясеня и ореха с маслом ручной работы.",
    bg: "radial-gradient(circle at 30% 30%,#f5edd8,transparent),radial-gradient(circle at 80% 70%,#ffe9c7,transparent),#FAFAF7",
  },
  {
    title: "Металл",
    text: "Латунь, чернёная сталь, патинирование и микрошлифовка.",
    bg: "radial-gradient(circle at 40% 40%,#d5d7dd,transparent),radial-gradient(circle at 70% 60%,#f1f5f9,transparent),#FAFAF7",
  },
  {
    title: "Ручная работа",
    text: "Соединения в шип, скругления кромок, подгонка фасадов вручную.",
    bg: "radial-gradient(circle at 50% 30%,#e7e0d6,transparent),radial-gradient(circle at 70% 70%,#f5f5f4,transparent),#FAFAF7",
  },
];

const ugc = [
  { title: "Интерьер #1", image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80", alt: "Льняной диван в светлой гостиной" },
  { title: "Интерьер #2", image: "https://images.unsplash.com/photo-1766023505762-2fd1359c4cb8?auto=format&fit=crop&w=900&q=80", alt: "Круглый обеденный стол" },
  { title: "Интерьер #3", image: "https://images.unsplash.com/photo-1768224461885-ea4785853779?auto=format&fit=crop&w=900&q=80", alt: "Дубовый стеллаж с вазами" },
  { title: "Интерьер #4", image: "https://images.unsplash.com/photo-1535049752-3baf525dd015?auto=format&fit=crop&w=900&q=80", alt: "Минималистичная спальня с комодом" },
  { title: "Интерьер #5", image: "https://images.unsplash.com/photo-1678705424487-a59e52b08275?auto=format&fit=crop&w=900&q=80", alt: "Торшер рядом с диваном" },
  { title: "Интерьер #6", image: "https://images.unsplash.com/photo-1630835016331-1a9b60581820?auto=format&fit=crop&w=900&q=80", alt: "Консоль из дуба и стали" },
];

const S = {
  section: { padding: "120px 60px", borderTop: "1px solid var(--line)", position: "relative" as const },
  sectionHeader: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", marginBottom: "80px", alignItems: "end" as const },
  sectionNum: { fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", color: "var(--gold)", textTransform: "uppercase" as const, marginBottom: "20px" },
  h2: { fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 54px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.01em" },
  sectionIntro: { color: "var(--mid)", lineHeight: 1.9, fontSize: "15px", alignSelf: "end" as const, paddingBottom: "4px" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://dubstal.ru/#organization",
      name: "Дуб & Сталь",
      url: "https://dubstal.ru",
      logo: { "@type": "ImageObject", url: "https://dubstal.ru/icon-512.png" },
      contactPoint: { "@type": "ContactPoint", telephone: "+7-495-000-00-00", contactType: "customer service", areaServed: "RU", availableLanguage: "Russian" },
      address: { "@type": "PostalAddress", addressLocality: "Мытищи", addressRegion: "Московская область", addressCountry: "RU" },
    },
    {
      "@type": "WebSite",
      "@id": "https://dubstal.ru/#website",
      url: "https://dubstal.ru",
      name: "Дуб & Сталь",
      publisher: { "@id": "https://dubstal.ru/#organization" },
      potentialAction: { "@type": "SearchAction", target: "https://dubstal.ru/catalog?q={search_term_string}", "query-input": "required name=search_term_string" },
    },
  ],
};

export default async function HomePage() {
  const caller = await createCaller();
  const allProducts = await caller.products.list();
  const spotlightProducts = allProducts.slice(0, 4);

  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroParallax />

      {/* ── Marquee ─────────────────────────────────────── */}
      <section style={{ background: "var(--ink)", padding: "20px 0", borderTop: "1px solid rgba(216,210,196,0.2)", borderBottom: "1px solid rgba(216,210,196,0.2)" }}>
        <div className="marquee-container">
          <div className="marquee" style={{ fontSize: "11px", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(138,128,112,0.7)" }}>
            {["Дуб", "Сталь", "Atelier", "Латунь", "Handcrafted", "Орех", "Gallery", "Чернёная сталь",
              "Дуб", "Сталь", "Atelier", "Латунь", "Handcrafted", "Орех", "Gallery", "Чернёная сталь"].map((w, i) => (
              <span key={i} style={{ flexShrink: 0, paddingRight: "3rem" }}>
                <span style={{ color: "var(--gold)", marginRight: "3rem" }}>·</span>
                {w}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Spotlight ───────────────────────── */}
      <section className="home-section" style={S.section}>
        <ScrollReveal>
          <div className="section-header" style={S.sectionHeader}>
            <div>
              <div style={S.sectionNum}>01 — Product Spotlight</div>
              <h2 style={S.h2}>
                Подборка<br /><em style={{ fontStyle: "italic", color: "var(--gold)" }}>недели</em>
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "flex-start", justifyContent: "flex-end" }}>
              <p style={S.sectionIntro}>
                Четыре предмета, отобранных редакцией. Каждую неделю — новый акцент на материал, форму или коллекцию.
              </p>
              <Link href="/catalog" style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", borderBottom: "1px solid var(--gold)", paddingBottom: "2px" }}>
                Весь каталог →
              </Link>
            </div>
          </div>
        </ScrollReveal>
        <HomeSpotlight products={spotlightProducts} />
      </section>

      {/* ── Materials & Philosophy ──────────────────── */}
      <section className="home-section" style={{ ...S.section, background: "var(--warm-gray)" }}>
        <ScrollReveal>
          <div className="section-header" style={S.sectionHeader}>
            <div>
              <div style={S.sectionNum}>02 — Материалы</div>
              <h2 style={S.h2}>
                Текстуры дерева<br />и <em style={{ fontStyle: "italic", color: "var(--gold)" }}>металла</em>
              </h2>
            </div>
            <p style={S.sectionIntro}>
              Дуб, ясень, орех — живые материалы с характером. Латунь и чернёная
              сталь — металл с историей. Каждое соединение — ручная работа.
            </p>
          </div>
        </ScrollReveal>

        <ScrollRevealStagger className="materials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {materials.map((mat) => (
            <div key={mat.title} style={{ background: mat.bg, border: "1px solid var(--line)", padding: "48px 40px", minHeight: "280px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 400, letterSpacing: "0.01em", marginBottom: "12px", color: "var(--ink)" }}>
                {mat.title}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--mid)", lineHeight: 1.7 }}>{mat.text}</p>
            </div>
          ))}
        </ScrollRevealStagger>
      </section>

      {/* ── UGC Gallery ─────────────────────────────── */}
      <section className="home-section" style={S.section}>
        <ScrollReveal>
          <div className="section-header" style={S.sectionHeader}>
            <div>
              <div style={S.sectionNum}>03 — Реальные интерьеры</div>
              <h2 style={S.h2}>
                Наша мебель<br />в <em style={{ fontStyle: "italic", color: "var(--gold)" }}>ваших</em> домах
              </h2>
            </div>
            <p style={S.sectionIntro}>
              Фото наших клиентов. Реальные интерьеры, живые истории,
              настоящие материалы — без студийного лоска.
            </p>
          </div>
        </ScrollReveal>

        <ScrollRevealStagger stagger={0.08} className="ugc-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {ugc.map((item) => (
            <div key={item.title} style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", border: "1px solid var(--line)" }}>
              <Image
                src={item.image}
                alt={item.alt}
                fill
                style={{ objectFit: "cover" }}
                sizes="(min-width: 1024px) 33vw, 50vw"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,14,12,0.35), transparent 50%)" }} />
              <span style={{ position: "absolute", left: "20px", bottom: "20px", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(250,250,247,0.85)" }}>
                {item.title}
              </span>
            </div>
          ))}
        </ScrollRevealStagger>
      </section>

      {/* ── Horizontal Scroll (Collections) ─────────── */}
      <HorizontalScroll />

      {/* ── CTA Strip ───────────────────────────────── */}
      <ScrollReveal>
        <section className="home-section" style={{ padding: "120px 60px", borderTop: "1px solid var(--line)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "32px" }}>
          <div style={S.sectionNum}>05 — Авторская мебель</div>
          <h2 style={{ ...S.h2, maxWidth: "700px" }}>
            Каждый предмет создаётся<br /><em style={{ fontStyle: "italic", color: "var(--gold)" }}>специально для вас</em>
          </h2>
          <p style={{ color: "var(--mid)", fontSize: "15px", lineHeight: 1.8, maxWidth: "480px" }}>
            Индивидуальные размеры, отделки и материалы. Производство в Подмосковье,
            доставка по всей России.
          </p>
          <Link
            href="/catalog"
            style={{ background: "var(--ink)", color: "var(--paper)", padding: "18px 48px", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "var(--font-body)", textDecoration: "none", display: "inline-block", transition: "background 0.2s" }}
          >
            Перейти в каталог
          </Link>
        </section>
      </ScrollReveal>
    </main>
  );
}
