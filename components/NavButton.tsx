import Link from "next/link";

type Props = {
  label: string;
  direction: "left" | "right";
  href?: string;
  onClick?: () => void;
  light?: boolean;
  hideLabelOnMobile?: boolean;
  className?: string;
};

export default function NavButton({
  label,
  direction,
  href,
  onClick,
  light,
  hideLabelOnMobile,
  className = "",
}: Props) {
  const classes = `nav-button group flex items-center gap-4 ${
    light ? "text-paper" : "text-ink"
  } ${direction === "right" ? "flex-row-reverse" : ""} ${className}`;

  const content = (
    <>
      <DiamondIcon direction={direction} />
      <span
        className={`nav-button__label button-text opacity-70 transition-opacity duration-300 group-hover:opacity-100 ${
          hideLabelOnMobile ? "hidden sm:block" : ""
        }`}
      >
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes} aria-label={label}>
      {content}
    </button>
  );
}

export function DiamondIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      className="nav-button__icon shrink-0 transition-transform duration-300 ease-out group-hover:scale-[1.15]"
    >
      <path d="M43.3 22L22 0.7L0.7 22L22 43.3L43.3 22Z" stroke="currentColor" />
      <path
        d="M28.1426 22L18.714 27.4436V16.5564L28.1426 22Z"
        fill="currentColor"
        transform={direction === "left" ? "rotate(180 22 22)" : undefined}
      />
    </svg>
  );
}
