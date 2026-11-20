const tips = ["Neutral expression", "Frontal pose", "Adequate lighting"];

export default function Tips({ light, done = 0 }: { light?: boolean; done?: number }) {
  return (
    <div className={`flex flex-col items-center gap-4 ${light ? "text-paper" : "text-ink"}`}>
      <p className="label text-center text-[12px] sm:text-[14px]">
        To get better results make sure to have
      </p>
      <ul className="flex flex-wrap justify-center gap-x-8 text-[12px] sm:text-[14px]">
        {tips.map((tip, i) => (
          <li
            key={tip}
            className={`flex items-center gap-[5px] leading-6 uppercase ${i < done ? "opacity-50" : ""}`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M0.75 6L6 0.75L11.25 6L6 11.25L0.75 6Z"
                stroke="currentColor"
                fill={i < done ? "currentColor" : "none"}
              />
            </svg>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
