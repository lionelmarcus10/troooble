import { ChallengeCardSearchComponent } from "@/components/ui/search-bar"
import { sampleLabels, sampleProducts } from "@/data/sample-products"
import { checkAuth } from '@/app/actions/auth/action'

export default async function Page() {
  // Protect this route - redirect to /auth if not authenticated
  await checkAuth()

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-6">
          <div className="max-w-8xl h-full mx-auto">
            <ChallengeCardSearchComponent items={sampleProducts} labels={sampleLabels} />
          </div>
        </div>
      </div>
    </div>
  )
}
