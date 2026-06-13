import { Icon } from "@iconify/react";

type Props = {
  title: string;
  count: string;
  rating: string;
};

export function GoogleRating({ title, count, rating }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="max-w-xs text-sm font-semibold text-white drop-shadow">
        {title}
      </p>
      <div className="flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow-md">
        <span className="rounded-full bg-dark-orange px-2 py-0.5 text-xs font-bold text-white">
          {count}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-gray-dark">{rating}</span>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon
                key={i}
                icon="material-symbols:star-rounded"
                width={16}
                className="text-light-orange"
              />
            ))}
          </div>
        </div>
        <Icon icon="logos:google-icon" width={18} />
      </div>
    </div>
  );
}
