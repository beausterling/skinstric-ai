"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Header from "@/components/Header";
import NavButton from "@/components/NavButton";
import Rhombuses from "@/components/Rhombuses";

type Side = "left" | "right";

export default function Home() {
  const container = useRef<HTMLElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      gsap.from(".title-line", {
        yPercent: 40,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });
      gsap.from(".fade-in", { autoAlpha: 0, duration: 1, delay: 0.4 });
      gsap.set(".extra", { autoAlpha: 0, scale: 0.94, transformOrigin: "50% 50%" });
    },
    { scope: container },
  );

  // hovering a side button slides the title to the other side like in the design
  const hoverSide = contextSafe((side: Side) => {
    if (window.innerWidth < 1024) return;
    const other = side === "right" ? "left" : "right";
    const direction = side === "right" ? -1 : 1;
    const [first, second] = gsap.utils.toArray<HTMLElement>(".title-text");
    const gap = (window.innerWidth - first.offsetWidth) / 2 - 32;
    const settings = { duration: 0.8, ease: "power3.out", overwrite: true };

    gsap.to(".title", { x: direction * gap, ...settings });
    gsap.to(second, { x: (direction * (first.offsetWidth - second.offsetWidth)) / 2, ...settings });
    gsap.to(`.side-${other}`, { autoAlpha: 0, ...settings });
    gsap.to(`.side-${side} .extra`, { autoAlpha: 1, scale: 1, ...settings });
    gsap.to(`.side-${side} .nav-button__icon`, { x: direction * 17, ...settings });
    gsap.to(`.side-${side} .nav-button__label`, { x: direction * 42, ...settings });
  });

  const leaveSide = contextSafe(() => {
    const settings = { duration: 0.8, ease: "power3.out", overwrite: true };
    gsap.to([".title", ".title-text", ".nav-button__label"], { x: 0, ...settings });
    gsap.to([".side-left", ".side-right"], { autoAlpha: 1, ...settings });
    gsap.to(".extra", { autoAlpha: 0, scale: 0.94, ...settings });
    gsap.to(".nav-button__icon", { x: 0, ...settings });
  });

  return (
    <main ref={container} className="relative h-screen min-h-[600px] overflow-hidden">
      <Header showCode />

      {/* desktop: half diamonds and buttons on each side */}
      <div className="side-left fade-in hidden lg:block">
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
          <Rhombuses sizes={[{ size: 602 }]} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Rhombuses
              sizes={[
                { size: 682, opacity: 0.6 },
                { size: 762, opacity: 0.3 },
              ]}
              className="extra invisible max-w-none"
            />
          </div>
        </div>
        <div
          className="absolute top-1/2 left-8 -translate-y-1/2"
          onMouseEnter={() => hoverSide("left")}
          onMouseLeave={leaveSide}
        >
          <NavButton label="Discover A.I." direction="left" />
        </div>
      </div>

      <div className="side-right fade-in hidden lg:block">
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
          <Rhombuses sizes={[{ size: 602 }]} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Rhombuses
              sizes={[
                { size: 682, opacity: 0.6 },
                { size: 762, opacity: 0.3 },
              ]}
              className="extra invisible max-w-none"
            />
          </div>
        </div>
        <div
          className="absolute top-1/2 right-8 -translate-y-1/2"
          onMouseEnter={() => hoverSide("right")}
          onMouseLeave={leaveSide}
        >
          <NavButton label="Take test" direction="right" href="/testing" />
        </div>
      </div>

      {/* mobile: diamonds sit behind the title */}
      <div className="fade-in absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden">
        <Rhombuses
          sizes={[{ size: 420 }, { size: 480, opacity: 0.6 }, { size: 540, opacity: 0.3 }]}
          className="max-w-none"
        />
      </div>

      {/* the outer div centers the title, gsap moves the inner one */}
      <div className="absolute top-1/2 left-1/2 w-max -translate-x-1/2 -translate-y-1/2">
        <div className="title flex flex-col items-center">
          <h1 className="text-center text-[60px] leading-[0.95] font-light tracking-[-0.07em] sm:text-[80px] lg:text-[clamp(88px,8.9vw,128px)] lg:translate-y-[7px] lg:leading-[0.9375]">
            <span className="title-line block">
              <span className="title-text inline-block">Sophisticated</span>
            </span>
            <span className="title-line block">
              <span className="title-text inline-block">skincare</span>
            </span>
          </h1>

          <div className="fade-in mt-6 flex flex-col items-center gap-8 lg:hidden">
            <p className="label w-[300px] text-center text-[12px] leading-5 opacity-70 sm:w-[316px] sm:text-[14px] sm:leading-6">
              Skinstric developed an A.I. that creates a highly-personalised routine tailored to
              what your skin needs.
            </p>
            <NavButton label="Enter experience" direction="right" href="/testing" />
          </div>
        </div>
      </div>

      <p className="fade-in label absolute bottom-[26px] left-8 hidden lg:block">
        Skinstric developed an A.I. that creates
        <br />
        a highly-personalised routine tailored to
        <br />
        what your skin needs.
      </p>
    </main>
  );
}
