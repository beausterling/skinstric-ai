"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Header from "@/components/Header";
import NavButton from "@/components/NavButton";
import Rhombuses from "@/components/Rhombuses";

const tile =
  "flex h-[154px] w-[154px] items-center justify-center bg-panel transition-colors duration-300";

export default function Select() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".tile", {
        scale: 0.8,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });
      gsap.from(".rhombus", {
        scale: 0.9,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        transformOrigin: "50% 50%",
      });
    },
    { scope: container },
  );

  return (
    <main ref={container} className="relative h-screen min-h-[640px] overflow-hidden">
      <Header section="Analysis" />
      <div className="absolute top-[86px] left-4 sm:left-8">
        <h1 className="label-bold">A. I. Analysis</h1>
        <p className="label mt-2">
          A. I. has estimated the following.
          <br />
          Fix estimated information if needed.
        </p>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Rhombuses
          sizes={[{ size: 602 }, { size: 682, opacity: 0.6 }, { size: 762, opacity: 0.3 }]}
          className="max-w-none scale-[0.55] sm:scale-90 lg:scale-100"
        />
      </div>

      {/* a 2x2 grid turned 45 degrees, the text is turned back */}
      <div className="absolute top-1/2 left-1/2 w-max -translate-x-1/2 -translate-y-1/2 scale-[0.72] sm:scale-100">
        <div className="grid rotate-45 grid-cols-2 gap-[6px]">
          <Link href="/summary" className={`tile ${tile} hover:bg-panel-dark`}>
            <span className="label-bold -rotate-45 text-center">Demographics</span>
          </Link>
          <button disabled className={`tile ${tile}`}>
            <span className="label-bold w-[96px] -rotate-45 text-center">Cosmetic concerns</span>
          </button>
          <button disabled className={`tile ${tile}`}>
            <span className="label-bold w-[80px] -rotate-45 text-center">Skin type details</span>
          </button>
          <button disabled className={`tile ${tile}`}>
            <span className="label-bold -rotate-45 text-center">Weather</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-9 left-4 sm:left-8">
        <NavButton label="Back" direction="left" href="/result" strong />
      </div>
      <div className="absolute right-4 bottom-9 sm:right-8">
        <NavButton label="Get summary" direction="right" href="/summary" strong />
      </div>
    </main>
  );
}
