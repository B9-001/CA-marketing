import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent-100 text-accent-600",
        outline: "border-border text-gray-600",
        dark: "border-transparent bg-navy text-white",
        hot: "border-transparent bg-red-100 text-red-700",
        warm: "border-transparent bg-orange-100 text-orange-700",
        potential: "border-transparent bg-blue-100 text-blue-700",
        low: "border-transparent bg-gray-100 text-gray-600",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
