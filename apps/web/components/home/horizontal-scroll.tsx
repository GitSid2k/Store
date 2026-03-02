"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const COLLECTIONS = [
  {
    slug: "living",
    label: "Гостиная",
    num: "01",
    text: "Диваны, журнальные столы, консоли из массива дуба и латуни.",
    color: "radial-gradient(circle at 30% 40%, #f5edd8 0%, #FAFAF7 60%)",
  },
  {
    slug: "dining",
    label: "Столовая",
    num: "02",
    text: "Обеденные столы и стулья для семейных ужинов.",
    color: "radial-gradient(circle at 60% 30%, #e8d5b5 0%, #FAFAF7 60%)",
  },
  {
    slug: "bedroom",
    label: "Спальня",
    num: "03",
    text: "Кровати и прикроватные тумбы — пространство для отдыха.",
    color: "radial-gradient(circle at 40% 60%, #d5d7dd 0%, #FAFAF7 60%)",
  },
  {
    slug: "lighting",
    label: "Освещение",
    num: "04",
    text: "Светильники из металла ручной работы — арт-деко и минимализм.",
    color: "radial-gradient(circle at 70% 40%, #e7e0d6 0%, #FAFAF7 60%)",
  },
  {
    slug: "storage",
    label: "Хранение",
    num: "05",
    text: "Полки и стеллажи для организации любого пространства.",
    color: "radial-gradient(circle at 30% 70%, #f5f0e8 0%, #FAFAF7 60%)",
  },
];

export function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const cards = track.querySelectorAll<HTMLElement>(".h-card");
    const totalWidth = track.scrollWidth - section.clientWidth;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${totalWidth + 200}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    tl.to(track, { x: -totalWidth, ease: "none" });

    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        overflow: "hidden",
        background: "var(--ink)",
        borderTop: "1px solid rgba(216,210,196,0.15)",
        borderBottom: "1px solid rgba(216,210,196,0.15)",
      }}
    >
      <div className="horizontal-scroll-header" style={{ padding: "80px 60px 40px" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "20px" }}>
          04 — Коллекции
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 54px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.01em", color: "white" }}>
          Пространства,<br /><em style={{ fontStyle: "italic", color: "var(--gold)" }}>созданные</em> для жизни
        </h2>
      </div>

      <div ref={trackRef} className="horizontal-scroll-track" style={{ display: "flex", gap: "24px", padding: "20px 60px 80px", width: "max-content" }}>
        {COLLECTIONS.map((col) => (
          <div
            key={col.slug}
            className="h-card"
            style={{
              width: "340px",
              flexShrink: 0,
              background: col.color,
              border: "1px solid var(--line)",
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "400px",
              cursor: "pointer",
              transition: "box-shadow 0.3s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 20px 60px rgba(154,122,58,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
          >
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "64px", fontWeight: 300, color: "transparent", WebkitTextStroke: "1px var(--line)", lineHeight: 1, marginBottom: "32px" }}>
                {col.num}
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 400, color: "var(--ink)", marginBottom: "16px", lineHeight: 1.1 }}>
                {col.label}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--mid)", lineHeight: 1.8 }}>
                {col.text}
              </p>
            </div>
            <Link
              href={`/collections/${col.slug}` as never}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "10px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--gold)",
                textDecoration: "none",
                borderBottom: "1px solid var(--gold)",
                paddingBottom: "4px",
                width: "fit-content",
              }}
            >
              Смотреть коллекцию
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
