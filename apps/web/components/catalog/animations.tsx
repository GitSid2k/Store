"use client";

import { useEffect } from "react";
import { animate, inView, stagger, motion, useScroll, useTransform } from "framer-motion";

/**
 * Framer-powered reveal animations for catalog sections via data-anim attributes.
 */
export function CatalogAnimations() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    const hero = document.querySelector("[data-anim=\"catalog-hero\"]");
    if (hero) {
      cleanups.push(
        inView(hero, () => {
          animate(hero, { opacity: [0, 1], y: [12, 0] }, { duration: 0.6, ease: "easeOut" });
        }, { margin: "0px 0px -10% 0px" })
      );
    }

    const filter = document.querySelector("[data-anim=\"filter-panel\"]");
    if (filter) {
      cleanups.push(
        inView(filter, () => {
          animate(filter, { opacity: [0, 1], y: [16, 0] }, { duration: 0.5, ease: "easeOut", delay: 0.1 });
        })
      );
    }

    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-anim=\"catalog-card\"]"));
    if (cards.length) {
      const grid = document.querySelector("[data-anim=\"catalog-grid\"]") ?? cards[0];
      if (grid) {
        cleanups.push(
          inView(grid, () => {
            animate(cards, { opacity: [0, 1], y: [16, 0] }, { duration: 0.45, ease: "easeOut", delay: stagger(0.06) });
          }, { margin: "0px 0px -10% 0px" })
        );
      }
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
