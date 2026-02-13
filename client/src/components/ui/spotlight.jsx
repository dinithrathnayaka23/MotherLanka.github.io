"use client";
import { useState } from "react";

const SpotlightCard = ({ children }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }}
      className="relative rounded-3xl overflow-hidden group"
    >
      {/* CHILD CONTENT (IMAGE) */}
      {children}

      {/* 🔥 ACTUAL SPOTLIGHT */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: `radial-gradient(
            300px circle at ${pos.x}px ${pos.y}px,
            rgba(255,255,255,0.75),
            rgba(255,255,255,0.35),
            transparent 60%
          )`,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
};

export default SpotlightCard;
