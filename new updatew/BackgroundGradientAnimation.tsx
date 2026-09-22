"use client";

import React from "react";
import { motion } from "framer-motion";

interface BackgroundGradientAnimationProps {
  children: React.ReactNode;
  className?: string;
  variant?: "dark" | "light" | "warm";
}

const variants = {
  dark: {
    bg: "#1a0a0a",
    orbs: [
      { color: "rgba(139,30,30,0.35)", size: 600, blur: 80, duration: 15, delay: 0 },
      { color: "rgba(196,163,90,0.25)", size: 500, blur: 90, duration: 18, delay: 2 },
      { color: "rgba(92,26,27,0.3)", size: 400, blur: 70, duration: 20, delay: 5 },
      { color: "rgba(180,140,60,0.15)", size: 350, blur: 60, duration: 22, delay: 8 },
    ],
  },
  light: {
    bg: "#F5F0E8",
    orbs: [
      { color: "rgba(196,163,90,0.15)", size: 500, blur: 100, duration: 20, delay: 0 },
      { color: "rgba(92,26,27,0.08)", size: 400, blur: 90, duration: 25, delay: 3 },
      { color: "rgba(139,30,30,0.06)", size: 450, blur: 80, duration: 18, delay: 6 },
    ],
  },
  warm: {
    bg: "#2d1212",
    orbs: [
      { color: "rgba(196,163,90,0.3)", size: 550, blur: 85, duration: 16, delay: 0 },
      { color: "rgba(139,30,30,0.4)", size: 450, blur: 75, duration: 19, delay: 2 },
      { color: "rgba(200,150,70,0.2)", size: 380, blur: 65, duration: 21, delay: 5 },
    ],
  },
};

export function BackgroundGradientAnimation({
  children,
  className = "",
  variant = "dark",
}: BackgroundGradientAnimationProps) {
  const config = variants[variant];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0" style={{ backgroundColor: config.bg }}>
        {config.orbs.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              filter: `blur(${orb.blur}px)`,
              left: `${(i * 30) % 100}%`,
              top: `${(i * 25) % 100}%`,
            }}
            animate={{
              x: ["-30%", "40%", "-20%", "10%"],
              y: ["-20%", "30%", "-40%", "20%"],
              scale: [1, 1.3, 0.9, 1.1],
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: orb.delay,
            }}
          />
        ))}
        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
