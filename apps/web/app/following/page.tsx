"use client"
import SectionHeader from '@/components/streaming/SectionHeader'
import { StreamCardSkeleton } from '@/components/streaming/Skeleton';
import StreamCard from '@/components/streaming/StreamCard';
import { recommendedStreams, trendingStreams } from '@/lib/mock-data';
import React, { useState } from 'react'



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

function Following() {

  const [loading, setLoading] = useState(true);

  return (
    <div className="px-4 pb-6 sm:px-5 lg:px-6">
    <SectionHeader title="Channels You Follow" />
    <StreamGrid streams={trendingStreams.slice(0, 4)} loading={loading} />
  </div>
  )
}

export default Following