"use client";

import { IconChevronLeft, IconChevronRight, IconUsers } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { featuredStreams } from "@/lib/mock-data";
import { formatViewerCount } from "@/lib/utils";
import { FeaturedStreamSkeleton } from "./Skeleton";

export default function FeaturedStream() {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featuredStreams.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <FeaturedStreamSkeleton />;
  }

  const stream = featuredStreams[current];

  return (
    <div className="relative ">
      <AnimatePresence mode="wait">
        <motion.div
          key={stream.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="group relative aspect-video overflow-hidden rounded-xl border border-border bg-surface"
        >
          <Image
            src={stream.thumbnail}
            alt={stream.title}
            
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 70vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-brand animate-pulse-live" />
            <span className="text-brand">LIVE</span>
            <span className="text-text-secondary">·</span>
            <IconUsers size={12} className="text-brand" />
            <span className="text-text-primary">{formatViewerCount(stream.viewers)}</span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <Image
                  src={stream.avatar}
                  alt={stream.streamer}
                  width={44}
                  height={44}
                  className="size-10 shrink-0 rounded-full border-2 border-brand/30 sm:size-11"
                />
                <div className="min-w-0">
                  <h1 className="line-clamp-2 text-base font-bold leading-snug text-text-primary sm:text-lg">
                    {stream.title}
                  </h1>
                  <p className="mt-0.5 text-sm font-medium text-text-secondary">
                    {stream.streamer}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-surface-elevated/80 px-2 py-0.5 text-xs font-medium text-text-secondary backdrop-blur-sm">
                      {stream.category}
                    </span>
                    <span className="rounded-md bg-surface-elevated/80 px-2 py-0.5 text-xs font-medium text-text-secondary backdrop-blur-sm">
                      {stream.language}
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="shrink-0 rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground transition-shadow hover:shadow-[0_0_24px_rgba(204,243,0,0.3)]"
              >
                Watch Now
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {featuredStreams.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current
                  ? "w-6 bg-brand"
                  : "w-1.5 bg-border hover:bg-text-muted"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            onClick={() =>
              setCurrent((prev) => (prev - 1 + featuredStreams.length) % featuredStreams.length)
            }
            className="flex size-8 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:border-brand/40 hover:text-brand"
            aria-label="Previous stream"
          >
            <IconChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setCurrent((prev) => (prev + 1) % featuredStreams.length)}
            className="flex size-8 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:border-brand/40 hover:text-brand"
            aria-label="Next stream"
          >
            <IconChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
