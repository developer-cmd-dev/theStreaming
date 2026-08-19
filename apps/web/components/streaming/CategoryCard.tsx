"use client";

import { IconUsers } from "@tabler/icons-react";
import { motion } from "motion/react";
import Image from "next/image";
import type { Category } from "@/lib/mock-data";
import { cn, formatViewerCount } from "@/lib/utils";

type CategoryCardProps = {
  category: Category;
  className?: string;
};

export default function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <motion.a
      href="#"
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative block aspect-[3/4] w-[140px] shrink-0 overflow-hidden rounded-xl border border-border sm:w-[160px]",
        className,
      )}
    >
      <Image
        src={category.thumbnail}
        alt={category.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="160px"
      />

      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t opacity-90 transition-opacity group-hover:opacity-100",
          category.gradient,
        )}
      />

      <div className="absolute inset-x-0 bottom-0 p-3">
        <h3 className="text-sm font-bold leading-tight text-text-primary sm:text-base">
          {category.name}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
          <IconUsers size={11} className="text-brand" />
          <span>{formatViewerCount(category.viewers)} watching</span>
        </div>
      </div>
    </motion.a>
  );
}
