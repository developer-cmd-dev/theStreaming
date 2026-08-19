"use client";

import {
  IconCompass,
  IconHeart,
  IconHome,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import RecommendedChannels from "./RecommendedChannels";
import { useState } from "react";
import Link from "next/link";


export const navItems = [
  { id: "home" as const, label: "Home", icon: IconHome, href: "/" },
  { id: "browse" as const, label: "Browse", icon: IconCompass, href: "/browse" },
  { id: "following" as const, label: "Following", icon: IconHeart, href: "/following" },
];


type SidebarProps = {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
};

export type Tabs =  "home" | "browse" | "following" 


export default function Sidebar({ open, collapsed, onClose }: SidebarProps) {

  const [active,setActive]=useState<Tabs>("home")

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-background pt-14 transition-all duration-300 lg:static lg:pt-0",
          collapsed ? "lg:w-[72px]" : "lg:w-60",
          open ? "w-60 translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <nav className="flex flex-col gap-0.5 p-3">
          {navItems.map(({ id, label, icon: Icon, href }) => (
            <Link
              key={id}
              href={href}
              onClick={()=>setActive(id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active === id
                  ? "bg-surface-elevated text-brand"
                  : "text-text-secondary hover:bg-surface hover:text-text-primary",
                collapsed && "lg:justify-center lg:px-2",
              )}
              title={collapsed ? label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              <span className={cn("truncate", collapsed && "lg:hidden")}>
                {label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mx-3 border-t border-border" />

        <div className={cn("flex-1 overflow-hidden", collapsed && "lg:hidden")}>
          <RecommendedChannels />
        </div>
      </aside>
    </>
  );
}
