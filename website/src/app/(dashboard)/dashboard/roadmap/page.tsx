import { ScrollArea } from '@/components/ui/scroll-area'
import RoadmapCard from '@/components/card-ui/RoadmapCard'
import { sampleRoadmaps } from '@/data/sample-roadmaps'
import React from 'react'

export default function Page() {
  return (
    <div className='h-full w-full p-6'>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Learning Roadmaps</h1>
          <p className="text-muted-foreground">
            Structured learning paths to master different technologies and skills
          </p>
        </div>

        {/* Roadmaps Grid */}
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
            {sampleRoadmaps.map((roadmap) => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
