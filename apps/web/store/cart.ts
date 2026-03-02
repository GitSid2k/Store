"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  slug: string;
  title: string;
  price: number;
  image: string;
  alt: string;
  qty: number;
};

type CartStore = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.slug === item.slug);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.slug === item.slug ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, qty: 1 }] };
        }),
      remove: (slug) =>
        set((state) => ({ items: state.items.filter((i) => i.slug !== slug) })),
      setQty: (slug, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.slug !== slug)
              : state.items.map((i) => (i.slug === slug ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: "dub-stal-cart" }
  )
);
