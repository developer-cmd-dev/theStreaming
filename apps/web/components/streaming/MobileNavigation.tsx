"use client";

import {
  IconCompass,
  IconHeart,
  IconHome,
  IconMessage,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

import { Tabs, navItems as tabs } from "./Sidebar";

export default function MobileNavigation() {
  const [activeTab,setActiveTab]=useState<Tabs>("home")
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
      {tabs.map(({ id, label, icon: Icon,href }) => (
        <Link
          href={href}
          key={id}
          type="button"
          onClick={()=>setActiveTab(id)}
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
            activeTab === id ? "text-brand" : "text-text-muted",
          )}
        >
          <Icon size={20} stroke={activeTab === id ? 2 : 1.5} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
