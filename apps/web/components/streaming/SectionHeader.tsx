"use client";

import { IconChevronRight } from "@tabler/icons-react";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function SectionHeader({
  title,
  actionLabel = "View all",
  onAction,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <h2 className="text-lg font-bold tracking-tight text-text-primary sm:text-xl">
        {title}
      </h2>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="group flex shrink-0 items-center gap-0.5 text-sm font-medium text-text-secondary transition-colors hover:text-brand"
        >
          {actionLabel}
          <IconChevronRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      )}
    </div>
  );
}
