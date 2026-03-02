import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal, ScrollRevealStagger } from "@/components/animations/scroll-reveal";

export const metadata: Metadata = {
  title: "О бренде — Дуб & Сталь",
  description: "История мастерской авторской мебели из Подмосковья. Массив дерева, кованый металл, ручная работа с 2018 года.",
};

const values = [
  { num: "01", title: "Только натуральное", text: "Массив дерева, кованый металл, натуральные масла и воски. Никакого МДФ и синтетики." },
  { num: "02", title: "Ручная работа", text: "Каждое соединение, каждая кромка — ручная подгонка мастером. Мы не гонимся за объёмом." },
  { num: "03", title: "На десятилетия", text: "Мебель, которую передают детям. Ремонтируется, реставрируется, живёт долго." },
];

const timeline = [
  { year: "2018", text: "Основание мастерской в Подмосковье. Первые заказы — столы из дуба для частных клиентов." },
  { year: "2020", text: "Расширение: цех металлообработки, линейка светильников. Первые коллаборации с дизайнерами интерьеров." },
  { year: "2022", text: "Запуск интернет-магазина. Коллекция «Atelier» — 12 предметов мебели в едином стиле." },
  { year: "2024", text: "Более 800 выполненных заказов. Доставка по всей России. Новая коллекция со вставками из латуни." },
];

const team = [
  { name: "Алексей Дорохин", role: "Основатель & главный мастер", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
  { name: "Мария Соколова", role: "Дизайнер коллекций", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80" },
  { name: "Игорь Блинов", role: "Мастер-кузнец", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" },
];

export default function AboutPage() {
  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <div style={{ position: "relative", height: "60vh", minHeight: "480px", overflow: "hidden" }}>
        <Image
          src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=1600&q=80"
          alt="Мастерская Дуб & Сталь"
          fill
          style={{ objectFit: "cover" }}
          priority
          sizes="100vw"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,14,12,0.75) 0%, rgba(15,14,12,0.2) 60%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "80px 60px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "20px" }}>
            О бренде · с 2018 года
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.02em", color: "white", maxWidth: "700px" }}>
            Мебель как<br /><em style={{ fontStyle: "italic", color: "var(--gold)" }}>философия</em>
          </h1>
        </div>
      </div>

      {/* ── Intro ── */}
      <ScrollReveal>
        <div style={{ padding: "100px 60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "120px", borderBottom: "1px solid var(--line)" }}>
          <div>
            <p style={{ color: "var(--mid)", fontSize: "16px", lineHeight: 1.9, marginBottom: "24px" }}>
              Дуб & Сталь — мастерская авторской мебели из Подмосковья. Мы создаём предметы интерьера, которые рассчитаны на десятилетия: массив дерева, кованый металл, ручная обработка.
            </p>
            <p style={{ color: "var(--mid)", fontSize: "16px", lineHeight: 1.9 }}>
              Каждый предмет проходит через руки мастера от эскиза до финальной шлифовки. Мы не используем МДФ и ДСП — только натуральные материалы с характером и историей.
            </p>
          </div>
          <div>
            <p style={{ color: "var(--mid)", fontSize: "16px", lineHeight: 1.9, marginBottom: "24px" }}>
              Дерево выдерживается минимум 3 года в наших складах — это гарантирует стабильность формы. Металл обрабатывается вручную: патинирование, шлифовка, воронение.
            </p>
            <p style={{ color: "var(--mid)", fontSize: "16px", lineHeight: 1.9 }}>
              Мы работаем на заказ и по каталогу. Срок изготовления — 5–7 недель. Доставляем по всей России.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* ── Values ── */}
      <div style={{ padding: "100px 60px", borderBottom: "1px solid var(--line)" }}>
        <ScrollReveal>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "60px" }}>
            Принципы
          </div>
        </ScrollReveal>
        <ScrollRevealStagger style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
          {values.map((v) => (
            <div key={v.num} style={{ borderTop: "2px solid var(--gold)", paddingTop: "24px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "40px", fontWeight: 300, color: "var(--line)", marginBottom: "16px" }}>{v.num}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400, marginBottom: "12px" }}>{v.title}</h3>
              <p style={{ color: "var(--mid)", fontSize: "14px", lineHeight: 1.8 }}>{v.text}</p>
            </div>
          ))}
        </ScrollRevealStagger>
      </div>

      {/* ── Timeline ── */}
      <div style={{ padding: "100px 60px", background: "var(--warm-gray)", borderBottom: "1px solid var(--line)" }}>
        <ScrollReveal>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "60px" }}>
            История
          </div>
        </ScrollReveal>
        <ScrollRevealStagger style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {timeline.map((t, i) => (
            <div key={t.year} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "40px", padding: "32px 0", borderTop: i === 0 ? "1px solid var(--line)" : "none", borderBottom: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 300, color: "var(--gold)", alignSelf: "center" }}>{t.year}</div>
              <p style={{ fontSize: "15px", color: "var(--mid)", lineHeight: 1.8, alignSelf: "center" }}>{t.text}</p>
            </div>
          ))}
        </ScrollRevealStagger>
      </div>

      {/* ── Team ── */}
      <div style={{ padding: "100px 60px", borderBottom: "1px solid var(--line)" }}>
        <ScrollReveal>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "60px" }}>
            Команда
          </div>
        </ScrollReveal>
        <ScrollRevealStagger style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
          {team.map((p) => (
            <div key={p.name}>
              <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", marginBottom: "20px", background: "var(--warm-gray)" }}>
                <Image src={p.image} alt={p.name} fill style={{ objectFit: "cover", filter: "grayscale(20%)" }} sizes="(min-width: 1024px) 33vw, 100vw" />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 400, marginBottom: "6px" }}>{p.name}</h3>
              <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>{p.role}</p>
            </div>
          ))}
        </ScrollRevealStagger>
      </div>

      {/* ── CTA ── */}
      <ScrollReveal>
        <div style={{ padding: "100px 60px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)" }}>
            Работаем на заказ
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 300, lineHeight: 1.1, maxWidth: "640px", letterSpacing: "-0.01em" }}>
            Создадим предмет<br /><em style={{ fontStyle: "italic", color: "var(--gold)" }}>специально для вас</em>
          </h2>
          <p style={{ color: "var(--mid)", fontSize: "15px", lineHeight: 1.8, maxWidth: "440px" }}>
            Индивидуальные размеры, отделки и материалы. Просто напишите нам — ответим в течение нескольких часов.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <Link href="/contacts" style={{ background: "var(--ink)", color: "white", padding: "14px 36px", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none", fontFamily: "var(--font-body)" }}>
              Связаться
            </Link>
            <Link href="/catalog" style={{ background: "transparent", color: "var(--ink)", padding: "14px 36px", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none", fontFamily: "var(--font-body)", border: "1px solid var(--line)" }}>
              Каталог
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
