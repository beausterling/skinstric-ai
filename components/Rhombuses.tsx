type Props = {
  // size is the width of each diamond from left corner to right corner
  sizes: { size: number; opacity?: number }[];
  className?: string;
};

// the dotted diamonds from the design, drawn as one svg
export default function Rhombuses({ sizes, className = "" }: Props) {
  const max = Math.max(...sizes.map((s) => s.size));
  const box = max + 2;
  const center = box / 2;

  return (
    <svg
      width={box}
      height={box}
      viewBox={`0 0 ${box} ${box}`}
      fill="none"
      className={`pointer-events-none ${className}`}
      aria-hidden
    >
      {sizes.map(({ size, opacity = 1 }) => {
        const half = size / 2 - 1;
        return (
          <path
            key={size}
            className="rhombus"
            d={`M${center} ${center - half}L${center + half} ${center}L${center} ${
              center + half
            }L${center - half} ${center}Z`}
            stroke="#A0A4AB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="0.1 8"
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
}
