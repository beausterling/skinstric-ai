import LoadingRhombuses from "@/components/LoadingRhombuses";

type Props = {
  text: string;
  icon?: React.ReactNode;
};

// full screen loading state with the spinning squares
export default function Loading({ text, icon }: Props) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-paper">
      <LoadingRhombuses>
        {icon}
        <p
          className={`label-bold text-center whitespace-nowrap ${
            icon ? "absolute top-[calc(50%+85px)]" : ""
          }`}
        >
          {text}
        </p>
      </LoadingRhombuses>
    </div>
  );
}
