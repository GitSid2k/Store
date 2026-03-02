import Link from "next/link";
import Image from "next/image";

const collections = [
  {
    slug: "atelier",
    name: "Коллекция Atelier",
    subtitle: "Дуб и латунь — классика в современном прочтении",
    year: "2024",
    image: "https://images.unsplash.com/photo-1766023505762-2fd1359c4cb8?auto=format&fit=crop&w=1200&q=80",
    count: 8,
  },
  {
    slug: "ridge",
    name: "Коллекция Ridge",
    subtitle: "Матовый орех — строгая геометрия и ручная отделка",
    year: "2024",
    image: "https://images.unsplash.com/photo-1535049752-3baf525dd015?auto=format&fit=crop&w=1200&q=80",
    count: 5,
  },
  {
    slug: "arc",
    name: "Коллекция Arc",
    subtitle: "Патинированный металл — свет и форма",
    year: "2023",
    image: "https://images.unsplash.com/photo-1678705424487-a59e52b08275?auto=format&fit=crop&w=1200&q=80",
    count: 4,
  },
  {
    slug: "loft",
    name: "Коллекция Loft",
    subtitle: "Лён и массив дуба — тепло натуральных материалов",
    year: "2023",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80",
    count: 6,
  },
];

export default function CollectionsPage() {
  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)", minHeight: "100vh", paddingTop: "120px" }}>
      <div style={{ padding: "60px 60px 40px" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "20px" }}>
          Коллекции
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "24px" }}>
          Авторские<br />
          <em style={{ fontStyle: "italic", color: "var(--gold)" }}>коллекции</em>
        </h1>
        <p style={{ color: "var(--mid)", fontSize: "15px", lineHeight: 1.8, maxWidth: "560px" }}>
          Каждая коллекция — это исследование материала, формы и пространства. Ограниченные тиражи, ручная работа, живые текстуры.
        </p>
      </div>

      <div className="collections-wrap" style={{ padding: "0 60px 120px" }}>
        {collections.map((col, i) => (
          <Link
            key={col.slug}
            href={`/catalog?collection=${col.slug}` as never}
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <div
              className="collections-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0",
                borderTop: "1px solid var(--line)",
                padding: "60px 0",
                alignItems: "center",
                transition: "opacity 0.3s",
              }}
            >
              <div style={{ order: i % 2 === 0 ? 0 : 1, padding: i % 2 === 0 ? "0 80px 0 0" : "0 0 0 80px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>
                  {col.year} · {col.count} предметов
                </div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 300, lineHeight: 1.1, marginBottom: "16px" }}>
                  {col.name}
                </h2>
                <p style={{ color: "var(--mid)", fontSize: "15px", lineHeight: 1.8, marginBottom: "32px" }}>
                  {col.subtitle}
                </p>
                <span style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", borderBottom: "1px solid var(--gold)", paddingBottom: "2px" }}>
                  Смотреть коллекцию →
                </span>
              </div>
              <div style={{ order: i % 2 === 0 ? 1 : 0, position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                <Image src={col.image} alt={col.name} fill style={{ objectFit: "cover", transition: "transform 0.6s ease" }} sizes="50vw" />
              </div>
            </div>
          </Link>
        ))}
        <div style={{ borderTop: "1px solid var(--line)" }} />
      </div>
    </main>
  );
}
