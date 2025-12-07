import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { PolarApi } from "@/lib/polar";
import { getOrCreatePolarCustomer } from "@/lib/polar-customer";
import { validateSubscription } from "@/lib/subscription-validation";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in first" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { priceId, productId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    // Validate subscription (check for duplicates, downgrades, etc.)
    const validation = await validateSubscription(productId, priceId);

    if (!validation.canSubscribe) {
      return NextResponse.json(
        {
          error: validation.reason,
          currentSubscription: validation.currentSubscription,
        },
        { status: 400 }
      );
    }

    // Get or create Polar customer for this user
    const customerResult = await getOrCreatePolarCustomer();

    if (!customerResult.success || !customerResult.customerId) {
      return NextResponse.json(
        { error: "Failed to create customer" },
        { status: 500 }
      );
    }

    // Create checkout session with Polar
    const checkoutResponse = await PolarApi.checkouts.create({
      products: [ productId ],
      customerId: customerResult.customerId,
      successUrl: process.env.POLAR_SUCCESS_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      customerMetadata: {
        supabase_id: user.id,
        email: user.email || "",
      },
    });

    if (!checkoutResponse.result) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkoutUrl: checkoutResponse.result.url,
      checkoutId: checkoutResponse.result.id,
    });
  } catch (error) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { error: "An error occurred while creating checkout session" },
      { status: 500 }
    );
  }
}
