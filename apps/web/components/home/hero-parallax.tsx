"use client";

import { motion } from "framer-motion";

export function HeroParallax() {
  return (
    <section
      className="hero-section"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "80px 60px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Hero background — exact from plan */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 60% at 70% 40%, rgba(154,122,58,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 20% 70%, rgba(15,14,12,0.04) 0%, transparent 50%),
            var(--paper)
          `,
        }}
      />

      {/* Grid lines — exact from plan */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(var(--line) 1px, transparent 1px),
            linear-gradient(90deg, var(--line) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          opacity: 0.3,
          maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      {/* Hero number — exact from plan */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: "140px",
          right: "60px",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(100px, 18vw, 220px)",
          fontWeight: 300,
          color: "transparent",
          WebkitTextStroke: "1px var(--line)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        01
      </motion.div>

      {/* Hero content — exact from plan */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        style={{ position: "relative", maxWidth: "800px" }}
      >
        {/* Label with gold line */}
        <div
          style={{
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span
            style={{
              display: "block",
              width: "40px",
              height: "1px",
              background: "var(--gold)",
              flexShrink: 0,
            }}
          />
          Дуб & Сталь · Авторская мебель
        </div>

        {/* h1 — exact from plan */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(52px, 7vw, 96px)",
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
            marginBottom: "32px",
          }}
        >
          Мебель<br />
          из <em style={{ fontStyle: "italic", color: "var(--gold)" }}>живого</em>
          <br />
          материала
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: "15px",
            color: "var(--mid)",
            maxWidth: "480px",
            lineHeight: 1.8,
          }}
        >
          Дизайнерская мебель и металлический декор, созданные вручную.
          Каждый предмет — история материала, мастерства и пространства.
        </p>
      </motion.div>

      {/* Scroll indicator — exact from plan */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        style={{
          position: "absolute",
          bottom: "80px",
          right: "60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "1px",
            height: "60px",
            background: "linear-gradient(to bottom, var(--gold), transparent)",
            animation: "scrollPulse 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--mid)",
            writingMode: "vertical-rl",
          }}
        >
          Прокрути
        </span>
      </motion.div>
    </section>
  );
}
