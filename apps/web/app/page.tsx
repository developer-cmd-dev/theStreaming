"use client";

import { useEffect, useState } from "react";
import {
  featuredCreators,
  popularCategories,
  recentlyWatched,
  recommendedStreams,
  topCategories,
  trendingStreams,
} from "@/lib/mock-data";
import CategorySection from "@/components/streaming/CategorySection";
import CreatorCard from "@/components/streaming/CreatorCard";
import FeaturedStream from "@/components/streaming/FeaturedStream";
import LiveChat from "@/components/streaming/LiveChat";
import MobileNavigation from "@/components/streaming/MobileNavigation";
import Navbar from "@/components/streaming/Navbar";
import SectionHeader from "@/components/streaming/SectionHeader";
import Sidebar from "@/components/streaming/Sidebar";
import { StreamCardSkeleton } from "@/components/streaming/Skeleton";
import StreamCard from "@/components/streaming/StreamCard";

function StreamGrid({
  streams,
  loading,
}: {
  streams: typeof recommendedStreams;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StreamCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {streams.map((stream) => (
        <StreamCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
}



export default function Dashboard() {
  const [mobileTab, setMobileTab] = useState<"home" | "browse" | "following" | "chat">("home");
  const [loading, setLoading] = useState(true);

  const isHome = mobileTab === "home";
  const isBrowse = mobileTab === "browse";
  const isFollowing = mobileTab === "following";
  const isChat = mobileTab === "chat";

  return (
      <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
        {(isHome || isChat) && (
          <div className="p-4 sm:p-5 lg:p-6 ">
            {isHome && (
              <div className="flex flex-col gap-4 xl:flex-row xl:gap-5">
                <div className="min-w-0 flex-1">
                  <FeaturedStream />
                </div>
                <div className="hidden xl:block xl:w-80 xl:shrink-0 2xl:w-90">
                  <div className="h-full min-h-80 xl:min-h-100">
                    <LiveChat />
                  </div>
                </div>
              </div>
            )}

            {isChat && (
              <div className="block h-[calc(100dvh-8rem)] lg:hidden">
                <LiveChat />
              </div>
            )}
          </div>
        )}

         {isHome && (
          <div className="space-y-8 px-4 pb-6 sm:px-5 lg:px-6">
            <CategorySection categories={topCategories} />

            <section>
              <SectionHeader title="Recommended Streams" />
              <StreamGrid streams={recommendedStreams} loading={loading} />
            </section>

            <section>
              <SectionHeader title="Trending Now" />
              <StreamGrid streams={trendingStreams} loading={loading} />
            </section>

            <section>
              <SectionHeader title="Recently Watched" />
              <StreamGrid streams={recentlyWatched} loading={loading} />
            </section>

            <CategorySection
              title="Popular Categories"
              categories={popularCategories}
              actionLabel="Browse all"
            />

            <section>
              <SectionHeader title="Featured Creators" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {featuredCreators.map((creator) => (
                  <CreatorCard key={creator.id} creator={creator} />
                ))}
              </div>
            </section>
          </div>
        )}


      </div>
  );
}


