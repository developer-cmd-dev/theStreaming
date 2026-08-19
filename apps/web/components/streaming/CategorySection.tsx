"use client";

import type { Category } from "@/lib/mock-data";
import CategoryCard from "./CategoryCard";
import SectionHeader from "./SectionHeader";

type CategorySectionProps = {
  title?: string;
  categories: Category[];
  actionLabel?: string;
};

export default function CategorySection({
  title = "Top Live Categories",
  categories,
  actionLabel = "View all",
}: CategorySectionProps) {
  return (
    <section>
      <SectionHeader title={title} actionLabel={actionLabel} />
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-thin sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
