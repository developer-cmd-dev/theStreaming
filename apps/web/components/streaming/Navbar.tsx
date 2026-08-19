"use client";

import {
  IconBell,
  IconGlobe,
  IconMenu2,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Dialog from "../Dialog";

type NavbarProps = {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
};

export default function Navbar({ onMenuToggle, sidebarOpen }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-3 backdrop-blur-md sm:gap-4 sm:px-4">
      <button
        type="button"
        onClick={onMenuToggle}
        className="flex size-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface hover:text-text-primary lg:hidden"
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      >
        {sidebarOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
      </button>

      <button
        type="button"
        onClick={onMenuToggle}
        className="hidden size-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface hover:text-text-primary lg:flex"
        aria-label="Toggle sidebar"
      >
        <IconMenu2 size={20} />
      </button>

      <a href="/" className="flex shrink-0 items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
              fill="#0D0D0F"
              stroke="#0D0D0F"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="hidden text-base font-bold tracking-tight sm:inline">
          Pulse<span className="text-brand">Live</span>
        </span>
      </a>

      <div className="mx-auto hidden max-w-xl flex-1 md:block">
        <div className="relative">
          <IconSearch
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="search"
            placeholder="Search streams, categories, creators..."
            className=" h-9 w-full rounded-full border border-border bg-surface pl-9 pr-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-brand/50 focus:ring-1 focus:ring-brand/30"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface hover:text-text-primary md:hidden"
          aria-label="Search"
        >
          <IconSearch size={18} />
        </button>

        <button
          type="button"
          className="hidden size-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface hover:text-text-primary sm:flex"
          aria-label="Language"
        >
          <IconGlobe size={18} />
        </button>

        <button
          type="button"
          className="hidden size-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface hover:text-text-primary sm:flex"
          aria-label="Notifications"
        >
          <IconBell size={18} />
        </button>

        <button
          type="button"
          className="hidden h-8 items-center rounded-md px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text-primary sm:flex"
        >
          Log In
        </button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="h-8 rounded-md bg-brand px-3 text-sm font-semibold text-brand-foreground transition-shadow hover:shadow-[0_0_20px_rgba(204,243,0,0.25)] sm:px-4"
        >
          Sign Up
        </motion.button>
      </div>
    </header>
  );
}
