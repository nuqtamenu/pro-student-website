"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import BlogCard from "./blog-card";
import { Blog, tx, type Locale } from "@/lib/data";

type Props = {
  blogs: Blog[];
};

function getPublicationTime(blog: Blog) {
  const time = Date.parse(blog.publishedAt.en);
  return Number.isNaN(time) ? 0 : time;
}

export default function BlogsFilter({ blogs }: Props) {
  const t = useTranslations("blogsPage");
  const locale = useLocale() as Locale;
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"default" | "newest" | "oldest">(
    "default",
  );

  const filteredBlogs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...blogs]
      .filter((blog) => {
        const title = tx(blog.title, locale).toLowerCase();
        const description = tx(blog.description, locale).toLowerCase();

        return (
          normalizedSearch.length === 0 ||
          title.includes(normalizedSearch) ||
          description.includes(normalizedSearch)
        );
      })
      .sort((a, b) => {
        if (sortOrder === "default") {
          return 0;
        }

        const aTime = getPublicationTime(a);
        const bTime = getPublicationTime(b);

        return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
      });
  }, [blogs, locale, search, sortOrder]);

  return (
    <section className="">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass rounded-4xl border border-white/20 bg-white/20 p-6 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1.5fr] lg:items-end lg:gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-dark/70">
                {t("label")}
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-gray-dark sm:text-4xl">
                {t("title")}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-dark/75">
                {t("description")}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-dark">
                  {t("search")}
                </span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-dark">
                  {t("sortDate")}
                </span>
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(event) =>
                      setSortOrder(
                        event.target.value as "default" | "newest" | "oldest",
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                  >
                    <option value="default">{t("sortDefault")}</option>
                    <option value="newest">{t("sortNewest")}</option>
                    <option value="oldest">{t("sortOldest")}</option>
                  </select>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-gray-dark">
            {filteredBlogs.length} {t("results")}
          </p>
        </div>

        {filteredBlogs.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                image={blog.image || "blog-placeholder.jpg"}
                publishedAt={tx(blog.publishedAt, locale)}
                title={tx(blog.title, locale)}
                description={tx(blog.description, locale)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-4xl border border-white/30 bg-white/80 p-10 text-center shadow-xl shadow-black/5 backdrop-blur-xl">
            <p className="text-xl font-semibold text-gray-dark">
              {t("noResults")}
            </p>
            <p className="mt-3 text-sm text-gray-dark/75">
              {t("noResultsDescription")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
