"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal-500/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-aurora-teal-600 to-aurora-purple-600 text-white shadow-lg shadow-aurora-teal-500/25 hover:shadow-aurora-teal-500/40 hover:from-aurora-teal-500 hover:to-aurora-purple-500",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-500",
        outline:
          "border border-border bg-card text-foreground shadow-sm hover:bg-aurora-teal-500/10 hover:border-aurora-teal-500/30 hover:text-aurora-teal-600 dark:hover:text-aurora-teal-400",
        secondary:
          "bg-aurora-purple-600 text-white shadow-sm hover:bg-aurora-purple-500",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-aurora-teal-600 dark:text-aurora-teal-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 sm:h-9 px-4 py-2",
        sm: "h-9 sm:h-8 rounded-lg px-3 text-xs",
        lg: "h-11 sm:h-10 rounded-lg px-8",
        icon: "h-10 w-10 sm:h-9 sm:w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
