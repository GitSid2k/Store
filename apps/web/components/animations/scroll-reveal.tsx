"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollReveal({
  children,
  delay = 0,
  y = 40,
  duration = 0.9,
  className,
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      }
    );
  }, [delay, y, duration]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

export function ScrollRevealStagger({
  children,
  stagger = 0.12,
  y = 30,
  duration = 0.8,
  className,
  style,
}: {
  children: React.ReactNode;
  stagger?: number;
  y?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.children;

    gsap.fromTo(
      items,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      }
    );
  }, [stagger, y, duration]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
