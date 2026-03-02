import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Дуб & Сталь",
    short_name: "ДубСталь",
    description: "Авторская мебель из массива дерева и кованого металла",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF7",
    theme_color: "#1A1814",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["shopping", "lifestyle"],
    lang: "ru",
  };
}
