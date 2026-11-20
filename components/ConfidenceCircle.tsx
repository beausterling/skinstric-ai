"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const RADIUS = 190.5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// the ring fills up to the confidence percentage
export default function ConfidenceCircle({ percent }: { percent: number }) {
  const ring = useRef<SVGCircleElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  const current = useRef({ value: 0 });

  useGSAP(
    () => {
      gsap.to(current.current, {
        value: percent,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => {
          const value = current.current.value;
          if (ring.current) {
            ring.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - value / 100));
          }
          if (number.current) {
            number.current.textContent = String(Math.round(value));
          }
        },
      });
    },
    { dependencies: [percent] },
  );

  return (
    <div className="relative aspect-square h-full max-h-[384px]">
      <svg viewBox="0 0 384 384" fill="none" className="h-full w-full -rotate-90">
        <circle cx="192" cy="192" r={RADIUS} stroke="#C1C2C3" strokeWidth="3" />
        <circle
          ref={ring}
          cx="192"
          cy="192"
          r={RADIUS}
          stroke="#1A1B1C"
          strokeWidth="3"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <p className="absolute top-1/2 left-1/2 flex -translate-x-[calc(50%-6px)] -translate-y-1/2 items-start text-[28px] leading-10 tracking-[-0.03em] sm:text-[40px]">
        <span ref={number}>0</span>
        <span className="-mt-3 ml-[3px] text-[16px] sm:text-[24px]">%</span>
      </p>
    </div>
  );
}
