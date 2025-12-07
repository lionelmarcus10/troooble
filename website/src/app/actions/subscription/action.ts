'use server'

import { prisma } from "../../../../prisma/clients";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export type SubscriptionStatus = {
  hasActiveSubscription: boolean;
  subscription: {
    id: string;
    status: string;
    productId: string;
    priceId: string | null;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
  } | null;
  tier: "free" | "pro" | "team";
};

/**
 * Get the current user's subscription status
 * Cached to prevent multiple database calls
 */
export const getUserSubscription = cache(async (): Promise<SubscriptionStatus> => {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        hasActiveSubscription: false,
        subscription: null,
        tier: "free",
      };
    }

    // Find user in our database
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: {
        subscriptions: {
          where: {
            status: {
              in: ["active", "trialing"],
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (!dbUser || dbUser.subscriptions.length === 0) {
      return {
        hasActiveSubscription: false,
        subscription: null,
        tier: "free",
      };
    }

    const subscription = dbUser.subscriptions[0];

    // Determine tier based on product ID (you'll need to configure this based on your Polar products)
    let tier: "free" | "pro" | "team" = "free";
    if (subscription.polarProductId) {
      // TODO: Map product IDs to tiers
      // For now, assume any active subscription is "pro"
      tier = "pro";
    }

    return {
      hasActiveSubscription: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        productId: subscription.polarProductId,
        priceId: subscription.polarPriceId,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      },
      tier,
    };
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return {
      hasActiveSubscription: false,
      subscription: null,
      tier: "free",
    };
  }
});

/**
 * Check if user has access to a specific feature
 */
export async function hasFeatureAccess(feature: string): Promise<boolean> {
  const { tier } = await getUserSubscription();

  // Define feature access by tier
  const featureAccess: Record<string, string[]> = {
    free: ["basic_scenarios", "progress_tracking"],
    pro: ["basic_scenarios", "progress_tracking", "advanced_labs", "priority_support", "certificates"],
    team: ["basic_scenarios", "progress_tracking", "advanced_labs", "priority_support", "certificates", "team_management", "custom_scenarios", "analytics"],
  };

  return featureAccess[tier]?.includes(feature) ?? false;
}

/**
 * Check if user can access premium content
 */
export async function canAccessPremiumContent(): Promise<boolean> {
  const { hasActiveSubscription } = await getUserSubscription();
  return hasActiveSubscription;
}

/**
 * Sync user data with Supabase auth
 * Call this after login to ensure user exists in database
 */
export async function syncUserWithDatabase() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!existingUser) {
      // Create user in database
      await prisma.user.create({
        data: {
          supabaseId: user.id,
          email: user.email || "",
          fullName: user.user_metadata?.fullName || user.user_metadata?.full_name || null,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error syncing user with database:", error);
    return { success: false, error: "Failed to sync user" };
  }
}

/**
 * Get all subscriptions for the current user
 */
export async function getUserSubscriptions() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return [];
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: {
        subscriptions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return dbUser?.subscriptions || [];
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    return [];
  }
}
