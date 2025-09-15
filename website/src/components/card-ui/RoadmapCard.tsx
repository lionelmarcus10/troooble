import React from 'react'
import DynamicIcon from '../icons/DynamicIcon'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RoadmapClientType } from '@/utils/types'

export default function RoadmapCard({ roadmap } : { roadmap : RoadmapClientType}) {
  return (
    <Card key={roadmap.id} className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <DynamicIcon name={roadmap.icon} />
          </div>
          <div>
            <CardTitle>{roadmap.title}</CardTitle>
            <CardDescription>{roadmap.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2">
          <div className="text-sm font-medium">What you'll learn:</div>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            {roadmap.topics.map((topic) => (
              <li key={topic.id}>{topic.content}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-muted-foreground">{roadmap.modules} modules</div>
          <Button asChild>
            <Link href={`/dashboard/roadmap/${roadmap.slug}`}>Start Learning</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
