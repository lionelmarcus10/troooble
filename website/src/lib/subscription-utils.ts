/**
 * Utility functions for subscription management
 */

export type SubscriptionTier = "free" | "pro" | "team";

/**
 * Map Polar product IDs to subscription tiers
 * TODO: Update these with your actual Polar product IDs
 */
export const PRODUCT_TIER_MAP: Record<string, SubscriptionTier> = {
  // Example: "prod_abc123": "pro",
  // Example: "prod_def456": "team",
};

/**
 * Get tier from product ID
 */
export function getTierFromProductId(productId: string): SubscriptionTier {
  return PRODUCT_TIER_MAP[productId] || "free";
}

/**
 * Feature access matrix
 */
export const FEATURE_ACCESS: Record<SubscriptionTier, string[]> = {
  free: [
    "basic_scenarios",
    "progress_tracking",
    "community_support",
  ],
  pro: [
    "basic_scenarios",
    "progress_tracking",
    "community_support",
    "advanced_labs",
    "priority_support",
    "certificates",
    "skill_assessments",
  ],
  team: [
    "basic_scenarios",
    "progress_tracking",
    "community_support",
    "advanced_labs",
    "priority_support",
    "certificates",
    "skill_assessments",
    "team_management",
    "custom_scenarios",
    "analytics_dashboard",
    "dedicated_support",
  ],
};

/**
 * Check if a tier has access to a feature
 */
export function hasFeature(tier: SubscriptionTier, feature: string): boolean {
  return FEATURE_ACCESS[tier]?.includes(feature) ?? false;
}

/**
 * Get all features for a tier
 */
export function getFeaturesForTier(tier: SubscriptionTier): string[] {
  return FEATURE_ACCESS[tier] || [];
}

/**
 * Compare tiers (returns positive if tier1 > tier2, negative if tier1 < tier2, 0 if equal)
 */
export function compareTiers(tier1: SubscriptionTier, tier2: SubscriptionTier): number {
  const tierOrder: Record<SubscriptionTier, number> = {
    free: 0,
    pro: 1,
    team: 2,
  };

  return tierOrder[tier1] - tierOrder[tier2];
}

/**
 * Format subscription status for display
 */
export function formatSubscriptionStatus(status: string): string {
  const statusMap: Record<string, string> = {
    active: "Active",
    trialing: "Trial",
    canceled: "Canceled",
    past_due: "Past Due",
    unpaid: "Unpaid",
    incomplete: "Incomplete",
    incomplete_expired: "Expired",
  };

  return statusMap[status] || status;
}

/**
 * Check if subscription is active
 */
export function isSubscriptionActive(status: string): boolean {
  return ["active", "trialing"].includes(status);
}

/**
 * Format date for subscription display
 */
export function formatSubscriptionDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
