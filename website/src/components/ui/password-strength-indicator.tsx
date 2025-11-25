"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { calculatePasswordStrength, type PasswordStrengthResult } from "@/utils/password-strength";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  showFeedback?: boolean;
  className?: string;
}

export function PasswordStrengthIndicator({
  password,
  showFeedback = true,
  className,
}: PasswordStrengthIndicatorProps) {
  const [result, setResult] = React.useState<PasswordStrengthResult | null>(null);

  React.useEffect(() => {
    if (password.length > 0) {
      setResult(calculatePasswordStrength(password));
    } else {
      setResult(null);
    }
  }, [password]);

  if (!result) return null;

  const strengthLabels: Record<string, string> = {
    weak: "Weak",
    fair: "Fair",
    good: "Good",
    strong: "Strong",
  };

  const strengthIcons: Record<string, React.ReactNode> = {
    weak: <AlertCircle className="h-3 w-3" />,
    fair: <Info className="h-3 w-3" />,
    good: <CheckCircle2 className="h-3 w-3" />,
    strong: <CheckCircle2 className="h-3 w-3" />,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className={cn("space-y-2", className)}
      >
        {/* Strength bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5" style={{ color: result.color }}>
              {strengthIcons[result.strength]}
              <span className="font-medium">
                Password strength: {strengthLabels[result.strength]}
              </span>
            </div>
            <span className="text-muted-foreground">{result.percentage}%</span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.percentage}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: result.color }}
            />
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && result.feedback.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs text-muted-foreground"
          >
            <div className="flex flex-col gap-1">
              {result.feedback.map((item, index) => (
                <div key={index} className="flex items-start gap-1.5">
                  <span className="mt-0.5">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
