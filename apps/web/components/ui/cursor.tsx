"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      ringPos.current.x = mouseX;
      ringPos.current.y = mouseY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
      ring.style.left = `${mouseX}px`;
      ring.style.top = `${mouseY}px`;
    };

    document.addEventListener("mousemove", handleMove);

    const hoverSelector = "a, button, [data-cursor=hover]";
    const enter = () => {
      dot.style.width = "16px";
      dot.style.height = "16px";
      ring.style.width = "56px";
      ring.style.height = "56px";
      ring.style.opacity = "0.2";
    };
    const leave = () => {
      dot.style.width = "8px";
      dot.style.height = "8px";
      ring.style.width = "36px";
      ring.style.height = "36px";
      ring.style.opacity = "0.5";
    };

    const hoverTargets = Array.from(document.querySelectorAll<HTMLElement>(hoverSelector));
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    return () => {
      document.removeEventListener("mousemove", handleMove);
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
