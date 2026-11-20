"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import NavButton, { DiamondIcon } from "@/components/NavButton";
import ConfidenceCircle from "@/components/ConfidenceCircle";
import { getDemographics } from "@/lib/storage";
import { Category, Demographics } from "@/types/demographics";

const categories: { key: Category; label: string }[] = [
  { key: "race", label: "Race" },
  { key: "age", label: "Age" },
  { key: "gender", label: "Sex" },
];

type Choices = Record<Category, string>;

// highest score first
function sortScores(scores: Record<string, number>) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1]);
}

// ages are listed from youngest to oldest like the design
function sortAges(scores: Record<string, number>) {
  return Object.entries(scores).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
}

function topChoices(data: Demographics): Choices {
  return {
    race: sortScores(data.race)[0][0],
    age: sortScores(data.age)[0][0],
    gender: sortScores(data.gender)[0][0],
  };
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function titleCase(text: string) {
  return text.split(" ").map(capitalize).join(" ");
}

export default function Summary() {
  const router = useRouter();
  const [data, setData] = useState<Demographics | null>(null);
  const [category, setCategory] = useState<Category>("race");
  const [choices, setChoices] = useState<Choices | null>(null);

  useEffect(() => {
    const saved = getDemographics();
    if (!saved) {
      router.replace("/result");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(saved);
    setChoices(topChoices(saved));
  }, [router]);

  if (!data || !choices) {
    return <main className="h-screen" />;
  }

  const scores = category === "age" ? sortAges(data.age) : sortScores(data[category]);
  const selected = choices[category];
  // reset only has something to do after one of the estimates was changed
  const estimate = topChoices(data);
  const changed =
    choices.race !== estimate.race ||
    choices.age !== estimate.age ||
    choices.gender !== estimate.gender;

  function step(direction: number) {
    const index = categories.findIndex((c) => c.key === category);
    const next = (index + direction + categories.length) % categories.length;
    setCategory(categories[next].key);
  }
  const heading = category === "age" ? `${selected} y.o.` : capitalize(selected);

  return (
    <main className="relative flex min-h-screen flex-col lg:h-screen lg:min-h-[850px]">
      <Header section="Analysis" />

      <div className="px-4 pt-[86px] sm:px-8">
        <p className="label-bold">A. I. Analysis</p>
        <div className="relative w-max">
          <h1 className="-ml-[3px] pt-[5px] text-[44px] leading-[64px] tracking-[-0.07em] uppercase sm:-ml-[5px] sm:translate-y-[4px] sm:text-[72px]">
            Demographics
          </h1>
          {/* the two arrows next to the title go to the previous and next category */}
          <div className="absolute -top-[18px] left-[calc(100%+13px)] hidden gap-2 sm:flex">
            <button onClick={() => step(-1)} aria-label="Previous category" className="group">
              <DiamondIcon direction="left" />
            </button>
            <button onClick={() => step(1)} aria-label="Next category" className="group">
              <DiamondIcon direction="right" />
            </button>
          </div>
        </div>
        <p className="label mt-[11px]">Predicted race &amp; age</p>
      </div>

      <div className="mt-6 grid flex-1 gap-4 px-4 sm:px-8 lg:mt-[clamp(24px,calc(100vh-870px),90px)] lg:min-h-0 lg:grid-cols-[208px_1fr_448px]">
        {/* the three results on the left */}
        <div className="grid grid-cols-3 gap-2 lg:flex lg:flex-col">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`label-bold flex h-[104px] flex-col justify-between border-t px-4 pt-[10px] pb-[13px] text-left transition-colors duration-200 ${
                category === key
                  ? "border-ink bg-ink text-paper"
                  : "border-ink bg-panel hover:bg-panel-dark"
              }`}
            >
              <span>{choices[key]}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* the selected result with the confidence ring */}
        <div className="relative flex min-h-[380px] flex-col border-t border-ink bg-panel lg:min-h-0">
          <p className="px-[15px] pt-[21px] text-[32px] leading-10 tracking-[calc(-0.05em+var(--tighten-title))] sm:text-[40px]">
            {heading}
          </p>
          {/* the ring is sized from this box so it never gets bigger than the space it has */}
          <div className="@container-[size] flex min-h-0 flex-1 items-end justify-center p-4 pb-6 lg:justify-end">
            <ConfidenceCircle percent={data[category][selected] * 100} />
          </div>
        </div>

        {/* every score, click one to correct the A.I. */}
        <div className="border-t border-ink bg-panel">
          <div className="flex justify-between px-4 pt-[13px] pb-[10px] text-[16px] leading-6 font-medium tracking-[calc(-0.02em+var(--tighten))] uppercase opacity-80">
            <span>{categories.find((c) => c.key === category)?.label}</span>
            <span>A. I. confidence</span>
          </div>
          <ul>
            {scores.map(([name, score]) => (
              <li key={name}>
                <button
                  onClick={() => setChoices({ ...choices, [category]: name })}
                  className={`flex h-12 w-full items-center gap-3 px-4 text-[16px] leading-6 tracking-[calc(-0.02em+var(--tighten))] transition-colors duration-200 ${
                    name === selected ? "bg-ink text-paper" : "hover:bg-panel-dark"
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M11.3 6L6 0.7L0.7 6L6 11.3L11.3 6Z" stroke="currentColor" />
                    {name === selected && <path d="M9 6L6 3L3 6L6 9L9 6Z" fill="currentColor" />}
                  </svg>
                  <span>{titleCase(name)}</span>
                  <span className="ml-auto">{Math.round(score * 100)} %</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 px-4 pt-8 pb-9 sm:px-8">
        <NavButton label="Back" direction="left" href="/select" />
        <p className="order-last w-full text-center text-[16px] leading-6 tracking-[calc(-0.02em+var(--tighten))] text-dot lg:absolute lg:bottom-[42px] lg:left-1/2 lg:w-auto lg:-translate-x-[calc(50%-19px)]">
          If A.I. estimate is wrong, select the correct one.
        </p>
        <div className="flex gap-[17px]">
          <button
            onClick={() => setChoices(estimate)}
            disabled={!changed}
            className="button-text border border-ink px-4 py-[8.5px] transition-[background-color,opacity] enabled:hover:bg-panel-dark disabled:cursor-not-allowed disabled:opacity-30"
          >
            Reset
          </button>
          <button
            onClick={() => router.push("/select")}
            className="button-text border border-ink bg-ink px-4 py-[8.5px] text-paper"
          >
            Confirm
          </button>
        </div>
      </div>
    </main>
  );
}
