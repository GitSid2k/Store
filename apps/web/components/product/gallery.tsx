"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImage = { url: string; alt: string };

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }

  const current = images[active] ?? images[0] ?? { url: "", alt: "" };

  return (
    <div>
      {/* Main image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4/5",
          overflow: "hidden",
          background: "var(--warm-gray)",
          border: "1px solid var(--line)",
          marginBottom: "16px",
          cursor: zoomed ? "zoom-out" : "zoom-in",
        }}
        onClick={() => setZoomed((z) => !z)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomed(false)}
      >
        <Image
          src={current.url}
          alt={current.alt}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          style={{
            objectFit: "cover",
            transition: "transform 0.4s ease",
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            transform: zoomed ? "scale(2)" : "scale(1)",
          }}
        />
        {images.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              right: "16px",
              background: "rgba(15,14,12,0.5)",
              color: "white",
              fontSize: "10px",
              letterSpacing: "0.1em",
              padding: "4px 10px",
            }}
          >
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: "72px",
                height: "72px",
                position: "relative",
                overflow: "hidden",
                border: i === active ? "1px solid var(--gold)" : "1px solid var(--line)",
                cursor: "pointer",
                background: "var(--warm-gray)",
                padding: 0,
                flexShrink: 0,
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = i === active ? "var(--gold)" : "var(--line)"; }}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="72px"
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
