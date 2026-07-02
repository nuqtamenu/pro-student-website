import BlogsFilter from "@/components/blogs-filter";
import { blogs } from "@/lib/data";

export default function InstitutesPage() {
  return (
    <div className="bg-linear-to-b from-dark-orange via-light-orange to-white w-full">
      <div className="mx-auto max-w-7xl w-full px-4 md:px-6 py-20">
        <BlogsFilter blogs={blogs} />
      </div>
    </div>
  );
}
