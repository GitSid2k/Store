import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        new: "bg-amber-50 text-brand-black border-amber-200",
        sale: "bg-red-50 text-red-700 border-red-200",
        popular: "bg-neutral-100 text-brand-black border-neutral-200",
        custom: "bg-brand-black text-brand-white border-brand-black",
      },
    },
    defaultVariants: {
      variant: "popular",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
