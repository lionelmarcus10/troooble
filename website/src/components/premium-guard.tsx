import { redirect } from "next/navigation";
import { getUserSubscription } from "@/app/actions/subscription/action";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Lock } from "lucide-react";

interface PremiumGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Server Component that guards premium content
 * Shows fallback UI or redirects if user doesn't have an active subscription
 */
export async function PremiumGuard({ children, fallback, redirectTo }: PremiumGuardProps) {
  const { hasActiveSubscription } = await getUserSubscription();

  if (!hasActiveSubscription) {
    if (redirectTo) {
      redirect(redirectTo);
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    // Default fallback UI
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Premium Content</CardTitle>
            <CardDescription>
              This content is only available to premium subscribers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Upgrade your plan to access advanced scenarios, priority support, and exclusive features.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/#pricing">View Plans</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

interface FeatureGuardProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that guards specific features based on subscription tier
 */
export async function FeatureGuard({ feature, children, fallback }: FeatureGuardProps) {
  const { tier } = await getUserSubscription();

  const featureAccess: Record<string, string[]> = {
    free: ["basic_scenarios", "progress_tracking"],
    pro: ["basic_scenarios", "progress_tracking", "advanced_labs", "priority_support", "certificates"],
    team: ["basic_scenarios", "progress_tracking", "advanced_labs", "priority_support", "certificates", "team_management", "custom_scenarios", "analytics"],
  };

  const hasAccess = featureAccess[tier]?.includes(feature) ?? false;

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return null;
  }

  return <>{children}</>;
}
