'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const priceId = searchParams.get("price");
    const productId = searchParams.get("product");

    if (!priceId) {
      setError("Missing price information");
      setLoading(false);
      return;
    }

    // Create checkout session
    createCheckoutSession(priceId, productId);
  }, [searchParams]);

  const createCheckoutSession = async (priceId: string, productId: string | null) => {
    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          productId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create checkout session");
        setLoading(false);
        return;
      }

      // Redirect to Polar checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError("Invalid checkout URL");
        setLoading(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle>Checkout Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={() => router.push("/#pricing")} className="w-full">
              View Pricing Plans
            </Button>
            <Button onClick={() => router.push("/dashboard")} variant="outline" className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Redirecting to checkout...</p>
        </CardContent>
      </Card>
    </div>
  );
}
