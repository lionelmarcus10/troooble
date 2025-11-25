import { checkAuth } from '@/app/actions/auth/action'

export default async function Page() {
  // Protect this route - redirect to /auth if not authenticated
    await checkAuth("/dashboard/user");
}
