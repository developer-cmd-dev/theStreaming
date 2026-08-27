"use client";

import {
  IconBell,
  IconGlobe,
  IconMenu2,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import Logo from "../Logo";


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

    <Logo/>

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


        <Link
          className="hidden h-8 items-center rounded-md px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text-primary sm:flex"
          href={'/login'}
        >
          Log In
        </Link>

        <Link
        
          className="h-8 rounded-md bg-brand px-3 text-sm font-semibold text-brand-foreground transition-shadow hover:shadow-[0_0_20px_rgba(204,243,0,0.25)] sm:px-4 flex items-center justify-center"
          href="/signup"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}
