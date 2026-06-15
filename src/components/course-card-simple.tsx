import Image from "next/image";

type Props = {
  image: string;
  name: string;
  discount?: number;
  provider: string;
  cta: string;
};
export default function CourseCardSimple({
  image,
  name,
  discount,
  provider,
  cta,
}: Props) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative h-60">
        <Image
          src={`/images/courses/${image}`}
          alt={name}
          fill
          sizes="(max-width: 768px) 80vw, 25vw"
          className="object-cover"
        />
        {discount && (
          <span className="absolute inset-e-3 top-3 rounded-full bg-light-orange flex items-center justify-center size-10 text-xs font-bold  shadow">
            {discount} %
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-4 bg-cream">
        <h3 className="text-xl uppercase font-medium text-gray-dark">{name}</h3>
        <p className="mt-1 text-xs font-medium text-dark-orange">{provider}</p>
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-light-orange py-2 text-sm font-bold text-gray-dark transition hover:bg-dark-orange hover:text-white cursor-pointer"
        >
          {cta}
        </button>
      </div>
    </article>
  );
}
