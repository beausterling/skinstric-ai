"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const squares = [
  { side: 427.5, rotation: 30, opacity: 0.3, duration: 28 },
  { side: 352.5, rotation: 45, opacity: 0.6, duration: 22 },
  { side: 286.8, rotation: 60, opacity: 1, duration: 16 },
];

// three dotted squares that slowly spin while something is loading
export default function LoadingRhombuses({ children }: { children?: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<SVGRectElement>(".loading-square").forEach((square, i) => {
        gsap.to(square, {
          rotation: "+=360",
          duration: squares[i].duration,
          ease: "none",
          repeat: -1,
          svgOrigin: "293 293",
        });
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="relative flex aspect-square w-[min(586px,92vw)] items-center justify-center"
    >
      <svg viewBox="0 0 586 586" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {squares.map(({ side, rotation, opacity }) => (
          <rect
            key={side}
            className="loading-square"
            x={293 - side / 2}
            y={293 - side / 2}
            width={side}
            height={side}
            transform={`rotate(${rotation} 293 293)`}
            stroke="#A0A4AB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="0.1 8"
            opacity={opacity}
          />
        ))}
      </svg>
      <div className="relative flex flex-col items-center">{children}</div>
    </div>
  );
}
