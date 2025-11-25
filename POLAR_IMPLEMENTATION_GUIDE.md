# Polar Integration Implementation Guide

This guide explains how to use the newly implemented Polar integration features for subscription management.

## Table of Contents
1. [Setup](#setup)
2. [Database Migration](#database-migration)
3. [Environment Variables](#environment-variables)
4. [Features Overview](#features-overview)
5. [Usage Examples](#usage-examples)
6. [Webhook Configuration](#webhook-configuration)
7. [Testing](#testing)

---

## Setup

### 1. Install Dependencies
All required dependencies are already installed:
- `@polar-sh/sdk` - Polar API SDK
- `@polar-sh/nextjs` - Next.js integration
- `@prisma/client` - Database ORM

### 2. Database Migration
Run the Prisma migration to create the subscription tables:

```bash
cd website
npx prisma migrate dev --name add_subscription_models
npx prisma generate
```

This will create the following tables:
- `User` - User data linked to Supabase auth
- `Subscription` - Polar subscription tracking
- `Order` - Order history

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
```env
POLAR_ACCESS_TOKEN=polar_at_...          # From Polar dashboard
POLAR_ENVIRONMENT=sandbox                # or production
POLAR_ORGANIZATION_ID=...                # Your Polar organization ID
POLAR_SUCCESS_URL=http://localhost:3000/checkout/success
POLAR_CANCEL_URL=http://localhost:3000
POLAR_WEBHOOK_SECRET=whsec_...           # From Polar webhook settings
DATABASE_URL=postgresql://...            # Supabase connection string
DIRECT_URL=postgresql://...              # Direct connection
```

---

## Features Overview

### 1. Dynamic Pricing Section
**File**: `src/components/magic/PricingSection.tsx`

- Automatically fetches products from Polar API
- Displays product images, descriptions, and benefits
- Supports multiple pricing types (fixed, free, custom)
- Responsive design with light/dark theme support
- Shows "Most Popular" badge on featured plans

### 2. Checkout Success Page
**File**: `src/app/checkout/success/page.tsx`

- Responsive success page with shadcn UI components
- Dark/light theme support
- Clear next steps for users
- Links to dashboard and subscription management

### 3. Webhook Handler
**File**: `src/app/api/webhooks/polar/route.ts`

Handles the following Polar events:
- `subscription.created` - Creates subscription in database
- `subscription.updated` - Updates subscription status
- `subscription.canceled` - Marks subscription as canceled
- `subscription.revoked` - Handles revoked subscriptions
- `order.created` - Records completed orders

**Security**: Verifies webhook signatures using HMAC-SHA256

### 4. Subscription Management
**File**: `src/app/actions/subscription/action.ts`

Server actions for subscription management:
- `getUserSubscription()` - Get current user's subscription status
- `hasFeatureAccess(feature)` - Check if user can access a feature
- `canAccessPremiumContent()` - Quick premium access check
- `syncUserWithDatabase()` - Sync Supabase user with database
- `getUserSubscriptions()` - Get all user subscriptions

### 5. Premium Content Guards
**File**: `src/components/premium-guard.tsx`

React Server Components for protecting content:
- `<PremiumGuard>` - Wraps premium content
- `<FeatureGuard>` - Guards specific features by tier

### 6. Subscription Badge
**File**: `src/components/subscription-badge.tsx`

Client component for displaying user's subscription tier

### 7. Utility Functions
**File**: `src/lib/subscription-utils.ts`

Helper functions for subscription logic

---

## Usage Examples

### Protecting Premium Pages

```tsx
// app/premium-scenarios/page.tsx
import { PremiumGuard } from "@/components/premium-guard";

export default function PremiumScenariosPage() {
  return (
    <PremiumGuard>
      <h1>Premium Scenarios</h1>
      {/* Your premium content here */}
    </PremiumGuard>
  );
}
```

### Custom Fallback UI

```tsx
import { PremiumGuard } from "@/components/premium-guard";

export default function MyPage() {
  return (
    <PremiumGuard
      fallback={
        <div>
          <h2>Upgrade Required</h2>
          <p>This content requires a Pro subscription.</p>
        </div>
      }
    >
      {/* Premium content */}
    </PremiumGuard>
  );
}
```

### Redirect to Pricing

```tsx
import { PremiumGuard } from "@/components/premium-guard";

export default function AdvancedLabsPage() {
  return (
    <PremiumGuard redirectTo="/#pricing">
      {/* Premium content */}
    </PremiumGuard>
  );
}
```

### Feature-Specific Guards

```tsx
import { FeatureGuard } from "@/components/premium-guard";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Everyone can see this */}
      <BasicStats />

      {/* Only Pro and Team tiers */}
      <FeatureGuard feature="analytics_dashboard">
        <AnalyticsDashboard />
      </FeatureGuard>

      {/* Only Team tier */}
      <FeatureGuard feature="team_management">
        <TeamManagement />
      </FeatureGuard>
    </div>
  );
}
```

### Checking Subscription in Server Components

```tsx
import { getUserSubscription } from "@/app/actions/subscription/action";

export default async function ProfilePage() {
  const { hasActiveSubscription, tier } = await getUserSubscription();

  return (
    <div>
      <h1>Profile</h1>
      <p>Current Plan: {tier}</p>
      {hasActiveSubscription && <p>Premium features enabled!</p>}
    </div>
  );
}
```

### Displaying Subscription Badge

```tsx
"use client";

import { SubscriptionBadge } from "@/components/subscription-badge";

export function UserProfile({ tier }: { tier: "free" | "pro" | "team" }) {
  return (
    <div className="flex items-center gap-2">
      <h2>John Doe</h2>
      <SubscriptionBadge tier={tier} />
    </div>
  );
}
```

### Using Subscription Utils

```tsx
import { hasFeature, compareTiers, formatSubscriptionStatus } from "@/lib/subscription-utils";

// Check if tier has a feature
if (hasFeature("pro", "advanced_labs")) {
  // Show advanced labs
}

// Compare tiers
if (compareTiers("team", "pro") > 0) {
  // Team tier is higher than Pro
}

// Format status
const status = formatSubscriptionStatus("active"); // "Active"
```

---

## Webhook Configuration

### Setting Up Polar Webhooks

1. Go to your Polar dashboard: https://polar.sh/dashboard/settings/webhooks
2. Click "Add Webhook"
3. Enter your webhook URL:
   - **Development**: Use ngrok or similar: `https://your-ngrok-url.ngrok.io/api/webhooks/polar`
   - **Production**: `https://yourdomain.com/api/webhooks/polar`
4. Select events to listen to:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
   - `subscription.revoked`
   - `order.created`
5. Copy the webhook secret and add it to your `.env.local` as `POLAR_WEBHOOK_SECRET`

### Testing Webhooks Locally

Use ngrok to expose your local server:

```bash
# Start your Next.js dev server
npm run dev

# In another terminal, start ngrok
ngrok http 3000

# Copy the HTTPS URL from ngrok and use it in Polar webhook settings
```

---

## Testing

### Test the Pricing Section

1. Start your dev server: `npm run dev`
2. Navigate to the homepage
3. Scroll to the pricing section
4. Verify that products are loaded from Polar
5. Check that images, prices, and benefits display correctly

### Test Checkout Flow

1. Click on a pricing plan
2. Complete the checkout process in the Polar checkout page
3. After payment, you should be redirected to `/checkout/success`
4. Verify the success page displays correctly

### Test Webhooks

1. Set up ngrok and configure Polar webhook
2. Make a test purchase
3. Check your server logs for webhook events
4. Verify database is updated:
   ```bash
   npx prisma studio
   ```
5. Check the User, Subscription, and Order tables

### Test Premium Guards

1. Create a test page with `<PremiumGuard>`
2. Try accessing without a subscription (should see upgrade prompt)
3. Purchase a subscription
4. Refresh the page (should see content)

---

## Product Tier Mapping

Update `src/lib/subscription-utils.ts` to map your Polar product IDs to tiers:

```typescript
export const PRODUCT_TIER_MAP: Record<string, SubscriptionTier> = {
  "prod_abc123": "pro",     // Your Polar Pro product ID
  "prod_def456": "team",    // Your Polar Team product ID
};
```

Get product IDs from Polar dashboard or by inspecting the API response.

---

## Customization

### Custom Feature Access

Edit `FEATURE_ACCESS` in `src/lib/subscription-utils.ts`:

```typescript
export const FEATURE_ACCESS: Record<SubscriptionTier, string[]> = {
  free: ["basic_feature_1", "basic_feature_2"],
  pro: ["basic_feature_1", "basic_feature_2", "pro_feature_1"],
  team: ["basic_feature_1", "basic_feature_2", "pro_feature_1", "team_feature_1"],
};
```

### Custom Pricing Display

Modify `formatPrice()` in `src/components/magic/PricingSection.tsx` to customize how prices are displayed.

### Custom Success Page

Edit `src/app/checkout/success/page.tsx` to match your branding and add custom messaging.

---

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db push

# View database in browser
npx prisma studio
```

### Webhook Not Receiving Events

1. Check that `POLAR_WEBHOOK_SECRET` is correctly set
2. Verify webhook URL in Polar dashboard
3. Check server logs for errors
4. Ensure server is publicly accessible (use ngrok for local testing)

### Subscription Not Showing

1. Check that user is logged in
2. Verify user exists in database
3. Check subscription status in database
4. Ensure `syncUserWithDatabase()` was called on login

---

## Next Steps

1. **Run database migration**: `npx prisma migrate dev`
2. **Configure environment variables**: Update `.env.local`
3. **Set up Polar webhook**: Add webhook URL in Polar dashboard
4. **Map product IDs to tiers**: Update `PRODUCT_TIER_MAP`
5. **Test the complete flow**: Sign up → Purchase → Access premium content
6. **Add premium content**: Use `<PremiumGuard>` to protect routes
7. **Customize styling**: Update components to match your theme

---

## Support

For issues with:
- **Polar API**: https://docs.polar.sh
- **Prisma**: https://www.prisma.io/docs
- **Supabase**: https://supabase.com/docs

---

## File Reference

### New Files Created
- `POLAR_INTEGRATION_STATUS.md` - Initial implementation status
- `POLAR_IMPLEMENTATION_GUIDE.md` - This file
- `.env.example` - Environment variable template
- `prisma/schema.prisma` - Updated with subscription models
- `src/components/magic/PricingSection.tsx` - Improved pricing display
- `src/app/checkout/success/page.tsx` - Success page
- `src/components/ui/card.tsx` - Card components
- `src/app/api/webhooks/polar/route.ts` - Webhook handler
- `src/app/actions/subscription/action.ts` - Subscription server actions
- `src/components/premium-guard.tsx` - Premium content guards
- `src/components/subscription-badge.tsx` - Subscription tier badge
- `src/lib/subscription-utils.ts` - Utility functions

### Modified Files
- `src/app/actions/auth/action.ts` - Added subscription sync on login/signup

---

**Implementation Complete!** 🎉

All features are now implemented and ready to use. Follow the setup steps above to get started.
