'use server'

import { PolarApi } from "./polar";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

/**
 * Get or create a Polar customer for the current user
 */
export async function getOrCreatePolarCustomer(): Promise<{
  success: boolean;
  customerId?: string;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if user exists in our database
    let dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    // Create user if doesn't exist
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          supabaseId: user.id,
          email: user.email || "",
          fullName: user.user_metadata?.fullName || user.user_metadata?.full_name || null,
        },
      });
    }

    // If user already has a Polar customer ID, return it
    if (dbUser.polarCustomerId) {
      return { success: true, customerId: dbUser.polarCustomerId };
    }

    // Create a new Polar customer
    try {
      const customerResponse = await PolarApi.customers.create({
        email: user.email!,
        name: user.user_metadata?.fullName || user.user_metadata?.full_name || undefined,
        metadata: {
          supabase_id: user.id,
        },
      });

      const customerId = customerResponse.id;

      // Update user with Polar customer ID
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { polarCustomerId: customerId },
      });

      return { success: true, customerId };
    } catch (polarError) {
      console.error("Error creating Polar customer:", polarError);
      return { success: false, error: "Failed to create customer" };
    }
  } catch (error) {
    console.error("Error in getOrCreatePolarCustomer:", error);
    return { success: false, error: "Internal error" };
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Sync Polar customer with current user data
 */
export async function syncPolarCustomer(customerId: string): Promise<void> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await PolarApi.customers.update({
      id: customerId,
      requestBody: {
        email: user.email!,
        name: user.user_metadata?.fullName || user.user_metadata?.full_name || undefined,
        metadata: {
          supabase_id: user.id,
        },
      },
    });
  } catch (error) {
    console.error("Error syncing Polar customer:", error);
  }
}
