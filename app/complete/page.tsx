"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Header from "@/components/Header";
import NavButton from "@/components/NavButton";
import Rhombuses from "@/components/Rhombuses";

const shapes = ["diamond", "dotted", "line", "triangle", "ring"] as const;

// the same pieces are made on the server and in the browser, so no random numbers here
const pieces = Array.from({ length: 64 }, (_, i) => ({
  shape: shapes[i % shapes.length],
  left: (i * 37 + 11) % 100,
  size: 10 + ((i * 7) % 5) * 4,
}));

function Piece({ shape, size }: { shape: (typeof shapes)[number]; size: number }) {
  const common = { width: size, height: size, viewBox: "0 0 20 20", fill: "none" };

  if (shape === "line") {
    return (
      <svg {...common}>
        <path d="M2 10H18" stroke="currentColor" />
      </svg>
    );
  }
  if (shape === "triangle") {
    return (
      <svg {...common}>
        <path d="M15 10L6 15.2V4.8L15 10Z" fill="currentColor" />
      </svg>
    );
  }
  if (shape === "ring") {
    return (
      <svg {...common}>
        <circle cx="10" cy="10" r="6.5" stroke="currentColor" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path
        d="M19 10L10 1L1 10L10 19L19 10Z"
        stroke="currentColor"
        strokeDasharray={shape === "dotted" ? "1 3" : undefined}
      />
    </svg>
  );
}

export default function Complete() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".rhombus", {
        scale: 0.9,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        transformOrigin: "50% 50%",
      });
      gsap.from(".title-line", {
        yPercent: 40,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });
      // the buttons come in after the title
      gsap.from(".fade-button", {
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.25,
        delay: 1.4,
        ease: "power2.out",
      });

      // no falling confetti for people who turned animations off
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const height = container.current?.offsetHeight ?? window.innerHeight;
        gsap.utils.toArray<HTMLElement>(".confetti").forEach((piece) => {
          gsap.set(piece, { autoAlpha: 1 });
          gsap.fromTo(
            piece,
            { y: -40, rotation: gsap.utils.random(0, 360) },
            {
              y: height + 40,
              x: gsap.utils.random(-120, 120),
              rotation: `+=${gsap.utils.random(-540, 540)}`,
              duration: gsap.utils.random(3.5, 6.5),
              delay: gsap.utils.random(0, 2.5),
              ease: "none",
              repeat: 2,
              repeatDelay: gsap.utils.random(0, 1),
            },
          );
        });
      });
    },
    { scope: container },
  );

  return (
    <main ref={container} className="relative h-screen min-h-[600px] overflow-hidden">
      <Header section="Analysis" />
      <p className="label-bold absolute top-[86px] left-4 sm:left-8">Analysis complete</p>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Rhombuses
          sizes={[{ size: 602 }, { size: 682, opacity: 0.6 }, { size: 762, opacity: 0.3 }]}
          className="max-w-none scale-[0.55] sm:scale-90 lg:scale-100"
        />
      </div>

      {/* confetti made from the same line shapes as the rest of the site, half as many on phones */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {pieces.map((piece, i) => (
          <span
            key={i}
            className={`confetti invisible absolute top-0 text-ink ${i % 2 ? "hidden sm:block" : ""}`}
            style={{ left: `${piece.left}%` }}
          >
            <Piece shape={piece.shape} size={piece.size} />
          </span>
        ))}
      </div>

      <div className="absolute top-1/2 left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center px-4 text-center">
        <p className="title-line label mb-[2px] opacity-40">Thank you</p>
        <h1 className="title-line text-[32px] leading-[1.07] tracking-[calc(-0.07em+var(--tighten-title))] sm:text-[44px] lg:text-[60px]">
          Congratulations
        </h1>
        <p className="title-line label mt-3 opacity-60">Your analysis is complete</p>
      </div>

      <div className="fade-button absolute bottom-9 left-4 sm:left-8">
        <NavButton label="Home" direction="left" href="/" />
      </div>
      <div className="fade-button absolute right-4 bottom-9 sm:right-8">
        <NavButton label="Restart" direction="right" href="/result" />
      </div>
    </main>
  );
}
