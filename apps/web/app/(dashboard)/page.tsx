
import CategorySection from '@/components/streaming/CategorySection'
import FeaturedStream from '@/components/streaming/FeaturedStream'
import LiveChat from '@/components/streaming/LiveChat'
import SectionHeader from '@/components/streaming/SectionHeader'
import { StreamCardSkeleton } from '@/components/streaming/Skeleton'
import StreamCard from '@/components/streaming/StreamCard'



import {
  featuredCreators,
  popularCategories,
  recentlyWatched,
  recommendedStreams,
  topCategories,
  trendingStreams,
} from "@/lib/mock-data";
import CreatorCard from "@/components/streaming/CreatorCard";
import { axiosHandler, AxiosPayload } from '@repo/axios'
import { HttpResponse, PublicUser } from '@repo/zod/schema'
import { CustomError } from '@repo/customError'
import { cookies } from 'next/headers'



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


async function Home() {




  return (
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">

      <div className="p-4 sm:p-5 lg:p-6 ">

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


        <div className="block h-[calc(100dvh-8rem)] lg:hidden">
          <LiveChat />
        </div>

      </div>


      =
      <div className="space-y-8 px-4 pb-6 sm:px-5 lg:px-6">
        <CategorySection categories={topCategories} />

        <section>
          <SectionHeader title="Recommended Streams" />
          <StreamGrid streams={recommendedStreams} loading={true} />
        </section>

        <section>
          <SectionHeader title="Trending Now" />
          <StreamGrid streams={trendingStreams} loading={true} />
        </section>

        <section>
          <SectionHeader title="Recently Watched" />
          <StreamGrid streams={recentlyWatched} loading={true} />
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
      =

    </div>
  )
}

export default Home




