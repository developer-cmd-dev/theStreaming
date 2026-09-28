"use client";

import {
  IconCompass,
  IconCurrencyDollar,
  IconDeviceAnalytics,
  IconHeart,
  IconHome,
  IconKey,
  IconPlayBug,
  IconTool,
  IconTrophy,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import RecommendedChannels from "./RecommendedChannels";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export const navItems = [
  { id: "home" as const, label: "Home", icon: IconHome, href: "/" },
  { id: "browse" as const, label: "Browse", icon: IconCompass, href: "/browse" },
  { id: "following" as const, label: "Following", icon: IconHeart, href: "/following" },
];

export const streamDashboardNavItems = [
  { id: "stream" as const, label: "Stream", icon: IconVideo, href: "/stream" },
  { id: "stream_url_key" as const, label: "Stream URL & Key", icon: IconKey, href: "/stream/channel" },
  { id: "revenue" as const, label: "Revenue", icon: IconCurrencyDollar, href: "/stream/revenue" },
  { id: "achievement" as const, label: "Achievement", icon: IconTrophy, href: "/stream/achievement" },
  { id: "studio" as const, label: "Studio", icon: IconPlayBug, href: "/stream/studio" },
  { id: "analytics" as const, label: "Analytics", icon: IconDeviceAnalytics, href: "/stream/analytics" },
  { id: "moderation" as const, label: "Moderation", icon: IconTool, href: "/stream/moderation" },
  { id: "community" as const, label: "Community", icon: IconUsers, href: "/stream/community" },
 
]


type SidebarProps = {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
};

export type Tabs =
  | "home"
  | "browse"
  | "following"
  | "stream"
  | "stream_url_key"
  | "revenue"
  | "achievement"
  | "studio"
  | "analytics"
  | "moderation"
  | "community"
  | "drops"
  | "rewards";


export default function Sidebar({ open, collapsed, onClose }: SidebarProps) {

  const [active, setActive] = useState<Tabs>("home");
  const pathname = usePathname();

  useEffect(()=>{
    if(pathname==='/stream'){
      setActive('stream')
    }
  },[pathname])

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
          collapsed ? "lg:w-18" : "lg:w-40 xl:w-60",
          open ? "w-60 translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {
          !pathname.startsWith('/stream') ? (
            <>
              <nav className="flex flex-col gap-0.5 p-3">
                {navItems.map(({ id, label, icon: Icon, href }) => (
                  <Link
                    key={id}
                    href={href}
                    onClick={() => setActive(id)}
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
            </>
          ) : (
            <>
             <nav className="flex flex-col gap-0.5 p-3">
                {streamDashboardNavItems.map(({ id, label, icon: Icon, href }) => (
                  <Link
                    key={id}
                    href={href}
                    onClick={() => setActive(id)}
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
            
            </>
          )
         
        }
      </aside>
    </>
  );
}
