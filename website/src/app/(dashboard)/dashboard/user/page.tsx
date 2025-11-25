import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import { checkAuth } from '@/app/actions/auth/action'
import data from "./data.json"

export default async function DashboardPage() {
  // Protect this route - redirect to /auth if not authenticated
  await checkAuth()

  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  )
}
