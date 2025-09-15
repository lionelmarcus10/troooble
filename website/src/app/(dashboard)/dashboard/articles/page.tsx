"use client"

import { ChallengeCardSearchComponent } from "@/components/ui/search-bar"
import { sampleProducts, sampleLabels } from "@/data/sample-products"

export default function ProductSearchPage() {
  
  console.log('Rendered!');

  return (
    <div className="min-h-screen">
      <ChallengeCardSearchComponent items={sampleProducts} labels={sampleLabels} />
    </div>
  )
}
