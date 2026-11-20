import Link from "next/link";

type Props = {
  section?: string;
  light?: boolean;
  showCode?: boolean;
};

export default function Header({ section = "Intro", light, showCode }: Props) {
  return (
    <header
      className={`absolute top-0 left-0 z-30 flex h-16 w-full items-center justify-between px-4 sm:px-8 ${
        light ? "text-paper" : "text-ink"
      }`}
    >
      <div className="flex items-center gap-4">
        <Link href="/" className="button-text">
          Skinstric
        </Link>
        <div className="flex items-center gap-[6px] opacity-60">
          <Bracket />
          <span className="button-text">{section}</span>
          <Bracket flip />
        </div>
      </div>
      {showCode && (
        <button className="bg-ink px-4 py-2 text-[10px] leading-4 font-semibold tracking-[calc(-0.02em+var(--tighten))] text-paper uppercase">
          Enter code
        </button>
      )}
    </header>
  );
}

function Bracket({ flip }: { flip?: boolean }) {
  return (
    <svg width="5" height="18" viewBox="0 0 5 18" fill="none" className={flip ? "rotate-180" : ""}>
      <path
        d="M4.5 17.5H2.5C1.39543 17.5 0.5 16.6046 0.5 15.5V2.5C0.5 1.39543 1.39543 0.5 2.5 0.5H4.5"
        stroke="currentColor"
      />
    </svg>
  );
}
