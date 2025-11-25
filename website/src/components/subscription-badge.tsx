"use client";

import { Badge } from "./ui/badge";
import { Crown, Users, Zap } from "lucide-react";

interface SubscriptionBadgeProps {
  tier: "free" | "pro" | "team";
  className?: string;
}

/**
 * Client Component that displays a badge based on subscription tier
 */
export function SubscriptionBadge({ tier, className }: SubscriptionBadgeProps) {
  const config = {
    free: {
      label: "Free",
      icon: null,
      variant: "secondary" as const,
    },
    pro: {
      label: "Pro",
      icon: <Zap className="w-3 h-3 mr-1" />,
      variant: "default" as const,
    },
    team: {
      label: "Team",
      icon: <Users className="w-3 h-3 mr-1" />,
      variant: "default" as const,
    },
  };

  const { label, icon, variant } = config[tier];

  return (
    <Badge variant={variant} className={className}>
      {icon}
      {label}
    </Badge>
  );
}
