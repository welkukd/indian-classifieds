"use client";

import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "brand" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  dot?: boolean;
  onRemove?: () => void;
}

const variantStyles = {
  default: "bg-neutral-100 text-neutral-700",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  error: "bg-error-50 text-error-700",
  info: "bg-info-50 text-info-700",
  brand: "bg-brand-50 text-brand-700",
  outline: "bg-transparent border border-neutral-300 text-neutral-700",
};

const sizeStyles = {
  xs: "px-2 py-0.5 text-xs gap-1",
  sm: "px-2.5 py-1 text-xs gap-1",
  md: "px-3 py-1 text-sm gap-1.5",
  lg: "px-4 py-1.5 text-base gap-2",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", size = "md", dot = false, onRemove, className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium rounded-full",
          variantStyles[variant],
          sizeStyles[size],
          onRemove && "pr-1",
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "rounded-full flex-shrink-0",
              variant === "default" && "bg-neutral-400",
              variant === "success" && "bg-success-500",
              variant === "warning" && "bg-warning-500",
              variant === "error" && "bg-error-500",
              variant === "info" && "bg-info-500",
              variant === "brand" && "bg-brand-500",
              variant === "outline" && "bg-neutral-400",
              size === "xs" && "w-1.5 h-1.5",
              size === "sm" && "w-1.5 h-1.5",
              size === "md" && "w-2 h-2",
              size === "lg" && "w-2.5 h-2.5"
            )}
            aria-hidden="true"
          />
        )}
        {children}
        {onRemove && (
          <button
            onClick={onRemove}
            className="ml-1.5 p-0.5 rounded-full hover:bg-black/10 transition-colors flex items-center justify-center"
            aria-label="Remove filter"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = "Badge";