type Props = {
  label?: string;
  title: string;
  align?: "center" | "start";
};

export function SectionHeading({ label, title, align = "center" }: Props) {
  return (
    <div
      className={`mb-8 flex flex-col gap-2 ${
        align === "center"
          ? "items-center text-center"
          : "items-start text-start"
      }`}
    >
      {label && (
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-dark-orange">
          {label}
        </span>
      )}
      <h2 className="text-balance text-2xl font-extrabold text-gray-dark sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}
