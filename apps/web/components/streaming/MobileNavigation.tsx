"use client";

import {
  IconCompass,
  IconHeart,
  IconHome,
  IconMessage,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type MobileNavigationProps = {
  activeTab: "home" | "browse" | "following" | "chat";
  onTabChange: (tab: "home" | "browse" | "following" | "chat") => void;
};

const tabs = [
  { id: "home" as const, label: "Home", icon: IconHome },
  { id: "browse" as const, label: "Browse", icon: IconCompass },
  { id: "following" as const, label: "Following", icon: IconHeart },
  { id: "chat" as const, label: "Chat", icon: IconMessage },
];

export default function MobileNavigation({
  activeTab,
  onTabChange,
}: MobileNavigationProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTabChange(id)}
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
            activeTab === id ? "text-brand" : "text-text-muted",
          )}
        >
          <Icon size={20} stroke={activeTab === id ? 2 : 1.5} />
          {label}
        </button>
      ))}
    </nav>
  );
}
