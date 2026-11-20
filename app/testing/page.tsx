"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Header from "@/components/Header";
import NavButton from "@/components/NavButton";
import Rhombuses from "@/components/Rhombuses";
import { letterEdges } from "@/lib/measure";
import { submitUser } from "@/lib/api";
import { saveUser } from "@/lib/storage";

type Step = "name" | "location" | "loading" | "done";

const questions = {
  name: "Introduce Yourself",
  location: "Where are you from?",
};

// only letters, spaces, hyphens, apostrophes and periods
const lettersOnly = /^[\p{L}\s'.-]+$/u;

export default function Testing() {
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const container = useRef<HTMLElement>(null);
  const underline = useRef<HTMLSpanElement>(null);

  const typing = step === "name" || step === "location";
  const value = step === "name" ? name : location;

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
    },
    { scope: container },
  );

  // spin the diamonds at different speeds while the form is sending
  useGSAP(
    () => {
      if (step !== "loading") return;
      gsap.utils.toArray<SVGPathElement>(".rhombus").forEach((rhombus, i) => {
        gsap.to(rhombus, {
          rotation: 360,
          duration: 12 + i * 5,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
        });
      });
    },
    { scope: container, dependencies: [step], revertOnUpdate: true },
  );

  // the first question waits for a click, after that the cursor stays in the input
  const lastStep = useRef(step);
  useEffect(() => {
    if (lastStep.current === step) return;
    lastStep.current = step;
    input.current?.focus();
  }, [step]);

  // the underline starts on the first letter and ends on the last one
  useLayoutEffect(() => {
    function place() {
      const line = underline.current;
      if (!line || !input.current || !typing) return;
      const edges = letterEdges(value || questions[step], input.current);
      line.style.left = `${edges.left}px`;
      line.style.right = `${edges.right}px`;
    }

    place();
    // measure again when the font has loaded or the text size changes
    document.fonts.ready.then(place);
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [value, step, typing]);

  function validate(text: string) {
    if (!text.trim()) {
      return step === "name" ? "Please enter your name" : "Please enter your location";
    }
    if (!lettersOnly.test(text.trim())) {
      return "Please use letters only, without numbers or special characters";
    }
    return "";
  }

  async function proceed() {
    const message = validate(value);
    if (message) {
      setError(message);
      return;
    }
    if (step === "name") {
      setStep("location");
      return;
    }

    setStep("loading");
    try {
      await submitUser(name.trim(), location.trim());
      saveUser(name.trim(), location.trim());
      setStep("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setStep("location");
    }
  }

  // clicking anywhere on the page puts the cursor back in the input
  function focusInput(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest("a, button")) return;
    input.current?.focus();
  }

  function goBack() {
    setError("");
    setStep("name");
  }

  function handleChange(text: string) {
    setError("");
    if (step === "name") setName(text);
    else setLocation(text);
  }

  return (
    <main
      ref={container}
      onClick={focusInput}
      className="relative h-screen min-h-[600px] overflow-hidden"
    >
      <Header />
      <p className="label-bold absolute top-[86px] left-4 sm:left-8">To start analysis</p>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Rhombuses
          sizes={[{ size: 602 }, { size: 682, opacity: 0.6 }, { size: 762, opacity: 0.3 }]}
          className="max-w-none scale-[0.55] sm:scale-90 lg:scale-100"
        />
      </div>

      <div className="absolute top-1/2 left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center px-4 pt-[11px]">
        {typing && (
          <form
            className="flex flex-col items-center"
            onSubmit={(e) => {
              e.preventDefault();
              proceed();
            }}
          >
            <label
              htmlFor="answer"
              className={`label mb-[2px] opacity-40 ${value ? "" : "lg:-translate-x-[7px]"}`}
            >
              {value ? questions[step] : "Click to type"}
            </label>
            {/* the hidden text sets the width, the underline is placed from the measured letters */}
            <div className="relative grid max-w-[92vw] pb-px text-[32px] leading-[1.07] tracking-[calc(-0.07em+var(--tighten-title))] sm:text-[44px] lg:text-[60px]">
              <span className="invisible col-start-1 row-start-1 px-[2px] whitespace-pre">
                {value || questions[step]}
              </span>
              <span ref={underline} className="absolute right-0 bottom-0 left-0 h-px bg-ink" />
              {/* the input is a little wider than the text so the last letter is not cut off */}
              <input
                ref={input}
                id="answer"
                key={step}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={questions[step]}
                autoComplete="off"
                className="absolute inset-y-0 -left-[0.15em] w-[calc(100%+0.3em)] bg-transparent px-[2px] pt-[3px] text-center outline-none transition-colors placeholder:text-ink placeholder:transition-colors focus:placeholder:text-ink/30 lg:pt-[6px]"
              />
            </div>
            <p className="label mt-3 h-6 text-[12px] text-red-700 normal-case sm:text-[14px]">
              {error}
            </p>
          </form>
        )}

        {step === "loading" && (
          <p className="label-bold animate-pulse opacity-60">Processing submission ...</p>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-[32px] leading-[1.07] tracking-[calc(-0.07em+var(--tighten-title))] sm:text-[44px] lg:text-[60px]">
              Thank you!
            </p>
            <p className="label opacity-60">Proceed for the next step</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-9 left-4 sm:left-8">
        {step === "location" ? (
          <NavButton label="Back" direction="left" onClick={goBack} />
        ) : (
          <NavButton label="Back" direction="left" href="/" />
        )}
      </div>

      <div className="absolute right-4 bottom-9 sm:right-8">
        {typing && value && <NavButton label="Proceed" direction="right" onClick={proceed} />}
        {step === "done" && <NavButton label="Proceed" direction="right" href="/result" />}
      </div>
    </main>
  );
}
