"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  id: string;
  slug: string;
  title: string;
  price: string;
  image: string;
  alt: string;
};

type WishlistStore = {
  items: WishlistItem[];
  add: (item: WishlistItem) => void;
  remove: (slug: string) => void;
  toggle: (item: WishlistItem) => void;
  has: (slug: string) => boolean;
  clear: () => void;
};

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => {
          if (state.items.find((i) => i.slug === item.slug)) return state;
          return { items: [...state.items, item] };
        }),
      remove: (slug) =>
        set((state) => ({ items: state.items.filter((i) => i.slug !== slug) })),
      toggle: (item) => {
        const exists = get().items.find((i) => i.slug === item.slug);
        if (exists) {
          set((state) => ({ items: state.items.filter((i) => i.slug !== item.slug) }));
        } else {
          set((state) => ({ items: [...state.items, item] }));
        }
      },
      has: (slug) => get().items.some((i) => i.slug === slug),
      clear: () => set({ items: [] }),
    }),
    { name: "dub-stal-wishlist" }
  )
);
