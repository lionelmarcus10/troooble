import { cn } from "@/lib/utils";
import { CircleCheck, CheckCircle2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { PolarApi } from "@/lib/polar";
import Image from "next/image";
import Link from "next/link";
import { getUserSubscription } from "@/app/actions/subscription/action";

// Type inference from Polar API response
type Product = Awaited<ReturnType<typeof PolarApi.products.list>>["result"]["items"][number];

interface PolarPricingCardProps {
    product: Product;
    featured?: boolean;
    isCurrentPlan?: boolean;
    currentPlanAmount?: number;
}

function formatPrice(product: Product): string {
    // Get the first price from the product
    const price = product.prices?.[0];

    if (!price) return "Contact us";

    // Handle free products
    if (price.amountType === "free") {
        return "Free";
    }

    // Handle fixed price products
    if (price.amountType === "fixed" && "priceAmount" in price) {
        const amount = `$${(price.priceAmount / 100).toFixed(0)}`;

        if (price.type === "recurring" && price.recurringInterval) {
            const interval = price.recurringInterval === "month" ? "month" : "year";
            return `${amount}/${interval}`;
        }

        return amount;
    }

    // Handle custom, metered, or seat-based pricing
    if (price.amountType === "custom") {
        return "Custom pricing";
    }

    return "Contact us";
}

function getPriceAmount(price: Product["prices"][number] | undefined): number {
    if (!price) return 0;
    if ("priceAmount" in price) {
        return price.priceAmount;
    }
    return 0;
}

function PolarPricingCard({ product, featured = false, isCurrentPlan = false, currentPlanAmount = 0 }: PolarPricingCardProps) {
    const price = formatPrice(product);
    const benefits = product.benefits || [];
    const image = product.medias?.[0];
    const priceId = product.prices?.[0]?.id;
    const productId = product.id;
    const planAmount = getPriceAmount(product.prices?.[0]);

    // Determine if this is an upgrade or downgrade
    const isUpgrade = currentPlanAmount > 0 && planAmount > currentPlanAmount;
    const isDowngrade = currentPlanAmount > 0 && planAmount < currentPlanAmount && planAmount > 0;

    return (
        <div
            className={cn(
                "flex flex-col rounded-lg border p-6 text-left transition-all",
                !isCurrentPlan && !isDowngrade && "hover:shadow-lg",
                featured && !isCurrentPlan && "border-primary shadow-lg ring-2 ring-primary/20 scale-105 relative",
                isCurrentPlan && "border-primary ring-2 ring-primary/30"
            )}
        >
            {featured && !isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        Most Popular
                    </span>
                </div>
            )}

            {isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Current Plan
                    </span>
                </div>
            )}

            <div className="text-center">
                {image && (
                    <div className="mb-4 flex justify-center">
                        <Image
                            src={image.publicUrl}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="object-contain"
                        />
                    </div>
                )}

                <div className="inline-flex items-center gap-2 mb-2">
                    <Badge variant={featured && !isCurrentPlan ? "default" : "secondary"}>
                        {product.name}
                    </Badge>
                </div>

                <h4 className="mb-2 text-3xl font-bold text-primary">
                    {price}
                </h4>

                {product.description && (
                    <p className="text-sm text-muted-foreground min-h-[40px]">
                        {product.description}
                    </p>
                )}
            </div>

            <div className="my-6 border-t" />

            <ul className="space-y-3 flex-1 mb-6">
                {benefits.map((benefit, index) => (
                    <li key={benefit.id || index} className="flex items-start text-sm">
                        <CircleCheck className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{benefit.description}</span>
                    </li>
                ))}
                {benefits.length === 0 && (
                    <li className="text-sm text-muted-foreground text-center">
                        Contact us for details
                    </li>
                )}
            </ul>

            <div className="mt-auto">
                {isCurrentPlan ? (
                    <Button
                        size="lg"
                        className="w-full"
                        variant="outline"
                        disabled
                    >
                        Current Plan
                    </Button>
                ) : isDowngrade ? (
                    <Button
                        size="lg"
                        className="w-full"
                        variant="outline"
                        disabled
                    >
                        Downgrade Not Allowed
                    </Button>
                ) : (
                    <Button
                        size="lg"
                        className="w-full"
                        variant={featured ? "default" : "outline"}
                        asChild
                    >
                        <Link href={priceId && productId ? `/checkout?price=${priceId}&product=${productId}` : '#'}>
                            {isUpgrade ? "Upgrade Now" : (price === "Free" ? "Get Started" : "Subscribe Now")}
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}

export default async function PricingSection() {
    try {
        // Fetch products from Polar
        const response = await PolarApi.products.list({
            isArchived: false,
            organizationId: process.env.POLAR_ORGANIZATION_ID
        });

        const products = response.result?.items || [];

        // Get current user's subscription
        const { subscription } = await getUserSubscription();
        const currentProductId = subscription?.productId;

        // Get current plan's price amount
        let currentPlanAmount = 0;
        if (subscription?.priceId) {
            for (const product of products) {
                const price = product.prices?.find(p => p.id === subscription.priceId);
                if (price) {
                    currentPlanAmount = getPriceAmount(price);
                    break;
                }
            }
        }

        // Sort products by price (lowest to highest)
        const sortedProducts = products.sort((a, b) => {
            const priceA = getPriceAmount(a.prices?.[0]);
            const priceB = getPriceAmount(b.prices?.[0]);
            return priceA - priceB;
        });

        // Mark the middle product as featured (or configure based on your preference)
        const featuredIndex = Math.floor(sortedProducts.length / 2);

        return (
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Choose Your Learning Path
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Start free and upgrade as you advance your troubleshooting expertise.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto md:grid-cols-2 lg:grid-cols-3 pt-4">
                        {sortedProducts.map((product, index) => {
                            const isCurrentPlan = product.id === currentProductId;

                            return (
                                <PolarPricingCard
                                    key={product.id}
                                    product={product}
                                    featured={index === featuredIndex && !isCurrentPlan}
                                    isCurrentPlan={isCurrentPlan}
                                    currentPlanAmount={currentPlanAmount}
                                />
                            );
                        })}
                    </div>

                    {products.length === 0 && (
                        <div className="text-center text-muted-foreground">
                            <p>No pricing plans available at the moment.</p>
                        </div>
                    )}
                </div>
            </section>
        );
    } catch (error) {
        console.error("Error fetching Polar products:", error);
        return (
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Choose Your Learning Path
                        </h2>
                        <p className="text-muted-foreground">
                            Unable to load pricing plans. Please try again later.
                        </p>
                    </div>
                </div>
            </section>
        );
    }
}
