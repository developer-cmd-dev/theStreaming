"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { Creator } from "@/lib/mock-data";
import { formatViewerCount } from "@/lib/utils";

type CreatorCardProps = {
  creator: Creator;
};

export default function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <motion.a
      href="#"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-brand/30 hover:bg-surface-elevated"
    >
      <div className="relative">
        <Image
          src={creator.avatar}
          alt={creator.name}
          width={64}
          height={64}
          className="size-16 rounded-full ring-2 ring-border transition-all group-hover:ring-brand/40"
        />
        {creator.isLive && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-md bg-brand px-1.5 py-0.5 text-[10px] font-bold text-brand-foreground">
            LIVE
          </span>
        )}
      </div>

      <div className="text-center">
        <p className="font-semibold text-text-primary transition-colors group-hover:text-brand">
          {creator.name}
        </p>
        <p className="mt-0.5 text-xs text-text-muted">{creator.category}</p>
        <p className="mt-1 text-xs font-medium text-text-secondary">
          {formatViewerCount(creator.followers)} followers
        </p>
      </div>
    </motion.a>
  );
}
