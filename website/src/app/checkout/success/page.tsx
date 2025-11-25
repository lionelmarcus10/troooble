import { Suspense } from "react";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function SuccessContent() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-base md:text-lg">
            Thank you for subscribing to Troooble. Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg">What happens next?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  You will receive a confirmation email with your subscription details
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Your premium features are now active and ready to use
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Access all scenarios and challenges from your dashboard
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild className="flex-1" size="lg">
              <Link href="/dashboard" className="flex items-center justify-center gap-2">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1" size="lg">
              <Link href="/dashboard/user">
                Manage Subscription
              </Link>
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our{" "}
              <Link href="/support" className="text-primary hover:underline">
                support team
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Processing your payment...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
