import Image from "next/image";

export default function DestinationCard({
  name,
  image,
  alt,
  labelCount,
  lableText,
  locale,
}: {
  image: string;
  alt: string;
  locale: string;
  labelCount: string | number;
  lableText: string;
  name: string;
}) {
  return (
    <article className="group relative h-105 overflow-hidden rounded-2xl">
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(max-width: 768px) 80vw, 25vw"
        className="object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="destination-overlay absolute inset-0 " />
      <span
        className={`absolute inset-s-4 top-6 w-25 ${locale === "ar" ? "right-0" : "left-0"} bg-dark-orange/90 px-3 py-1 text-sm font-bold text-white shadow`}
      >
        {labelCount} {lableText}
      </span>
      <h3 className="absolute inset-x-4 bottom-5 text-xl font-medium uppercase text-white drop-shadow-lg">
        {name}
      </h3>
    </article>
  );
}
