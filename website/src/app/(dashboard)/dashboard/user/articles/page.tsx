import { checkAuth } from '@/app/actions/auth/action'

export default async function ProductSearchPage() {
  // Protect this route - redirect to /auth if not authenticated
  await checkAuth()

  return (
    <div className="min-h-screen">
      {/* Articles content will go here */}
    </div>
  )
}
