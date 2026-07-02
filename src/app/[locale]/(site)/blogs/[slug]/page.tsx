import { format } from "date-fns";
import { notFound } from "next/navigation";
import { blogs, Locale, tx } from "@/lib/data";
import Image from "next/image";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogs.flatMap((blog) =>
    ["en", "ar"].map((locale) => ({ locale, slug: blog.slug })),
  );
}

export default async function BlogPage({ params }: Props) {
  const { locale, slug } = await params;

  const blog = blogs.find((item) => item.slug === slug);

  if (!blog) {
    notFound();
  }

  const currentLocale = locale === "ar" ? "ar" : "en";
  const title = tx(blog.title, currentLocale as Locale);
  const publishedAt = tx(blog.publishedAt, currentLocale as Locale);
  const rawContent = tx(blog.content, currentLocale as Locale);
  const content = rawContent.replace(/^\s*<h1>.*?<\/h1>\s*/is, "");

  const isYearOnly = /^\d{4}$/.test(publishedAt.trim());
  const formattedDate = isYearOnly
    ? publishedAt
    : format(new Date(publishedAt), "MMMM d, yyyy");

  return (
    <main className="blog-page">
      <div className="blog-page__wrapper">
        <article className="blog-article">
          <header className="blog-article__header">
            <p className="blog-meta">{formattedDate}</p>
            <h1 className="blog-title">{title}</h1>
          </header>

          <div className="blog-image-wrap">
            <Image
              src={`/images/blogs/${blog.image}`}
              alt={title}
              className="blog-featured-image"
              width={1000}
              height={400}
            />
          </div>

          <div
            className="blog-article__content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>
      </div>
    </main>
  );
}
