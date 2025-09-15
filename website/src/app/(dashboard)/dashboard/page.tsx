import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function page() {
  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Skeleton className="bg-muted/50 aspect-video rounded-xl" />
          <Skeleton className="bg-muted/50 aspect-video rounded-xl" />
          <Skeleton className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <Skeleton className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </>
  )
}
