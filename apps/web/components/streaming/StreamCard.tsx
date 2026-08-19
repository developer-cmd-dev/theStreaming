"use client";

import { IconUsers } from "@tabler/icons-react";
import { motion } from "motion/react";
import Image from "next/image";
import type { Stream } from "@/lib/mock-data";
import { formatViewerCount } from "@/lib/utils";

type StreamCardProps = {
  stream: Stream;
  size?: "default" | "compact";
};

export default function StreamCard({ stream, size = "default" }: StreamCardProps) {
  return (
    <motion.a
      href="#"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col gap-2.5"
    >
      <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-surface">
        <Image
          src={stream.thumbnail}
          alt={stream.title}
          fill
          className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {stream.isLive && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-brand animate-pulse-live" />
            <span className="text-brand">LIVE</span>
          </div>
        )}

        {stream.isLive && (
          <div className="absolute right-2 top-2 flex items-center gap-0.5 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-text-primary backdrop-blur-sm">
            <IconUsers size={11} className="text-brand" />
            {formatViewerCount(stream.viewers)}
          </div>
        )}

        {!stream.isLive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-md bg-surface-elevated/90 px-2 py-1 text-xs font-medium text-text-secondary">
              Offline
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2.5">
        <Image
          src={stream.avatar}
          alt={stream.streamer}
          width={36}
          height={36}
          className="size-9 shrink-0 rounded-full ring-1 ring-border"
        />
        <div className="min-w-0 flex-1">
          <h3
            className={`line-clamp-2 font-semibold text-text-primary transition-colors group-hover:text-brand ${
              size === "compact" ? "text-sm" : "text-sm sm:text-[15px]"
            }`}
          >
            {stream.title}
          </h3>
          <p className="mt-0.5 truncate text-sm text-text-secondary">{stream.streamer}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-text-muted">
            <span className="rounded bg-surface-elevated px-1.5 py-0.5">{stream.category}</span>
            {stream.isLive && (
              <>
                <span>·</span>
                <span>{formatViewerCount(stream.viewers)} viewers</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.a>
  );
}
