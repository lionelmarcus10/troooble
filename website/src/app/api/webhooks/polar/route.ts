import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Webhook event types from Polar
type PolarWebhookEvent = {
  type: string;
  data: {
    id: string;
    created_at: string;
    attributes: Record<string, unknown>;
  };
};

type SubscriptionEvent = {
  id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  customer_id: string;
  product_id: string;
  price_id: string | null;
  user_id?: string;
  metadata?: Record<string, unknown>;
};

type OrderEvent = {
  id: string;
  amount: number;
  currency: string;
  customer_id: string;
  product_id: string;
  user_id?: string;
  metadata?: Record<string, unknown>;
};

// Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

// Handle subscription.created event
async function handleSubscriptionCreated(subscription: SubscriptionEvent) {
  try {
    // Find user by Supabase ID if provided in metadata
    const supabaseId = subscription.metadata?.supabase_id as string | undefined;

    if (!supabaseId) {
      console.warn("No supabase_id in subscription metadata", subscription.id);
      return;
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { supabaseId },
    });

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          supabaseId,
          email: subscription.metadata?.email as string || "",
          polarCustomerId: subscription.customer_id,
        },
      });
    } else if (!user.polarCustomerId) {
      // Update user with Polar customer ID
      user = await prisma.user.update({
        where: { id: user.id },
        data: { polarCustomerId: subscription.customer_id },
      });
    }

    // Create subscription record
    await prisma.subscription.create({
      data: {
        userId: user.id,
        polarSubscriptionId: subscription.id,
        polarCustomerId: subscription.customer_id,
        polarProductId: subscription.product_id,
        polarPriceId: subscription.price_id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start),
        currentPeriodEnd: new Date(subscription.current_period_end),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at) : null,
        metadata: subscription.metadata,
      },
    });

    console.log(`Subscription created: ${subscription.id} for user: ${user.id}`);
  } catch (error) {
    console.error("Error handling subscription.created:", error);
    throw error;
  }
}

// Handle subscription.updated event
async function handleSubscriptionUpdated(subscription: SubscriptionEvent) {
  try {
    await prisma.subscription.update({
      where: { polarSubscriptionId: subscription.id },
      data: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start),
        currentPeriodEnd: new Date(subscription.current_period_end),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at) : null,
        metadata: subscription.metadata,
      },
    });

    console.log(`Subscription updated: ${subscription.id}`);
  } catch (error) {
    console.error("Error handling subscription.updated:", error);
    throw error;
  }
}

// Handle subscription.canceled event
async function handleSubscriptionCanceled(subscription: SubscriptionEvent) {
  try {
    await prisma.subscription.update({
      where: { polarSubscriptionId: subscription.id },
      data: {
        status: "canceled",
        canceledAt: new Date(),
        cancelAtPeriodEnd: true,
      },
    });

    console.log(`Subscription canceled: ${subscription.id}`);
  } catch (error) {
    console.error("Error handling subscription.canceled:", error);
    throw error;
  }
}

// Handle order.created event
async function handleOrderCreated(order: OrderEvent) {
  try {
    const supabaseId = order.metadata?.supabase_id as string | undefined;

    let userId: string | undefined;

    if (supabaseId) {
      const user = await prisma.user.findUnique({
        where: { supabaseId },
      });
      userId = user?.id;
    }

    await prisma.order.create({
      data: {
        userId,
        polarOrderId: order.id,
        polarCustomerId: order.customer_id,
        amount: order.amount,
        currency: order.currency,
        status: "succeeded",
        productId: order.product_id,
        metadata: order.metadata,
      },
    });

    console.log(`Order created: ${order.id}`);
  } catch (error) {
    console.error("Error handling order.created:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("x-polar-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    // Verify webhook signature
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("POLAR_WEBHOOK_SECRET is not set");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const isValid = verifyWebhookSignature(body, signature, webhookSecret);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse webhook event
    const event: PolarWebhookEvent = JSON.parse(body);

    // Handle different event types
    switch (event.type) {
      case "subscription.created":
        await handleSubscriptionCreated(event.data.attributes as unknown as SubscriptionEvent);
        break;

      case "subscription.updated":
        await handleSubscriptionUpdated(event.data.attributes as unknown as SubscriptionEvent);
        break;

      case "subscription.canceled":
      case "subscription.revoked":
        await handleSubscriptionCanceled(event.data.attributes as unknown as SubscriptionEvent);
        break;

      case "order.created":
        await handleOrderCreated(event.data.attributes as unknown as OrderEvent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
