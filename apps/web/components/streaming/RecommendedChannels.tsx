"use client";

import { IconUsers } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { recommendedChannels } from "@/lib/mock-data";
import { cn, formatViewerCount } from "@/lib/utils";

const INITIAL_VISIBLE = 5;

export default function RecommendedChannels() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded
    ? recommendedChannels
    : recommendedChannels.slice(0, INITIAL_VISIBLE);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <p className="px-4 pb-2 pt-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
        Recommended
      </p>

      <ul className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-2">
        {visible.map((channel) => (
          <li key={channel.id}>
            <a
              href="#"
              className="group flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-surface"
            >
              <div className="relative shrink-0">
                <Image
                  src={channel.avatar}
                  alt={channel.name}
                  width={32}
                  height={32}
                  className="size-8 rounded-full bg-surface-elevated ring-2 ring-border"
                />
                {channel.isLive && (
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background bg-brand animate-pulse-live" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary group-hover:text-brand transition-colors">
                  {channel.name}
                </p>
                <p className="truncate text-xs text-text-muted">{channel.category}</p>
              </div>

              {channel.isLive && (
                <div className="flex shrink-0 items-center gap-1 text-xs font-medium text-brand">
                  <IconUsers size={12} />
                  <span>{formatViewerCount(channel.viewers)}</span>
                </div>
              )}
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className={cn(
          "mx-3 mb-3 rounded-md py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface hover:text-brand",
        )}
      >
        {expanded ? "Show Less" : "Show More"}
      </button>
    </div>
  );
}
