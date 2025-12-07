'use server'

import { prisma } from "../../prisma/clients";
import { createClient } from "@/utils/supabase/server";
import { PolarApi } from "./polar";

export type SubscriptionValidationResult = {
  canSubscribe: boolean;
  reason?: string;
  currentSubscription?: {
    productId: string;
    priceId: string;
    priceAmount: number;
    status: string;
    currentPeriodEnd: Date;
  };
};

/**
 * Get price amount from Polar API
 */
async function getPriceAmount(priceId: string): Promise<number> {
  try {
    // Fetch all products and find the price
    const productsResponse = await PolarApi.products.list({
      isArchived: false,
    });

    for (const product of productsResponse.result?.items || []) {
      for (const price of product.prices || []) {
        if (price.id === priceId) {
          // Handle different price types
          if ("priceAmount" in price) {
            return price.priceAmount;
          }
          return 0;
        }
      }
    }

    return 0;
  } catch (error) {
    console.error("Error fetching price amount:", error);
    return 0;
  }
}

/**
 * Validate if user can subscribe to a new product/price
 * Returns whether they can subscribe and the reason if not
 */
export async function validateSubscription(
  productId: string,
  priceId: string
): Promise<SubscriptionValidationResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        canSubscribe: false,
        reason: "You must be logged in to subscribe",
      };
    }

    // Get user from database
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
        },
      },
    });

    if (!dbUser || dbUser.subscriptions.length === 0) {
      // No active subscription, user can subscribe
      return { canSubscribe: true };
    }

    const currentSubscription = dbUser.subscriptions[0];

    // Check if trying to subscribe to the same product
    if (currentSubscription.polarProductId === productId) {
      // Check if it's the same price
      if (currentSubscription.polarPriceId === priceId) {
        return {
          canSubscribe: false,
          reason: "You are already subscribed to this plan",
          currentSubscription: {
            productId: currentSubscription.polarProductId,
            priceId: currentSubscription.polarPriceId || "",
            priceAmount: 0,
            status: currentSubscription.status,
            currentPeriodEnd: currentSubscription.currentPeriodEnd,
          },
        };
      }
    }

    // Get current and new price amounts to compare
    const currentPriceAmount = currentSubscription.polarPriceId
      ? await getPriceAmount(currentSubscription.polarPriceId)
      : 0;
    const newPriceAmount = await getPriceAmount(priceId);

    // Check if this is a downgrade (lower price)
    if (newPriceAmount < currentPriceAmount && newPriceAmount > 0) {
      return {
        canSubscribe: false,
        reason: "Downgrades are not allowed. Please cancel your current subscription first.",
        currentSubscription: {
          productId: currentSubscription.polarProductId,
          priceId: currentSubscription.polarPriceId || "",
          priceAmount: currentPriceAmount,
          status: currentSubscription.status,
          currentPeriodEnd: currentSubscription.currentPeriodEnd,
        },
      };
    }

    // Allow upgrades (higher price) or same price from different product
    return {
      canSubscribe: true,
      currentSubscription: {
        productId: currentSubscription.polarProductId,
        priceId: currentSubscription.polarPriceId || "",
        priceAmount: currentPriceAmount,
        status: currentSubscription.status,
        currentPeriodEnd: currentSubscription.currentPeriodEnd,
      },
    };
  } catch (error) {
    console.error("Error validating subscription:", error);
    return {
      canSubscribe: false,
      reason: "An error occurred while validating your subscription",
    };
  }
}

/**
 * Check if user has any active subscription
 */
export async function hasActiveSubscription(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: {
        subscriptions: {
          where: {
            status: {
              in: ["active", "trialing"],
            },
          },
        },
      },
    });

    return (dbUser?.subscriptions.length || 0) > 0;
  } catch (error) {
    console.error("Error checking active subscription:", error);
    return false;
  }
}
