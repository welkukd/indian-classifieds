"use client";

import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";
import { generateAvatarColor, getInitials } from "@/lib/utils";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  shape?: "circle" | "square";
  status?: "online" | "offline" | "busy" | "away";
  statusPosition?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

const sizeStyles = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
  "2xl": "w-24 h-24 text-2xl",
};

const statusSizeStyles = {
  xs: "w-1.5 h-1.5",
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
  xl: "w-4 h-4",
  "2xl": "w-5 h-5",
};

const statusPositionStyles = {
  "bottom-right": "bottom-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "top-right": "top-0 right-0",
  "top-left": "top-0 left-0",
};

const statusColors = {
  online: "bg-success-500",
  offline: "bg-neutral-400",
  busy: "bg-error-500",
  away: "bg-warning-500",
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = "md",
      shape = "circle",
      status,
      statusPosition = "bottom-right",
      className,
      ...props
    },
    ref
  ) => {
    const showFallback = !src || src === "";
    const borderRadius = shape === "circle" ? "rounded-full" : "rounded-xl";

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex shrink-0 overflow-hidden",
          sizeStyles[size],
          borderRadius,
          className
        )}
        {...props}
      >
        {showFallback ? (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center font-semibold select-none",
              generateAvatarColor(name || "User")
            )}
            aria-hidden="true"
          >
            {name ? getInitials(name) : <svg className="w-1/2 h-1/2 text-current opacity-60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>}
          </div>
        ) : (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        {status && (
          <span
            className={cn(
              "absolute border-2 border-white rounded-full",
              statusSizeStyles[size],
              statusColors[status],
              statusPositionStyles[statusPosition]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export const AvatarGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { max?: number; size?: keyof typeof sizeStyles }>(
  ({ max = 5, size = "md", className, children, ...props }, ref) => {
    const childrenArray = Array.isArray(children) ? children : [children];
    const visibleChildren = childrenArray.slice(0, max);
    const remainingCount = childrenArray.length - max;

    return (
      <div ref={ref} className={cn("flex -space-x-2", className)} {...props}>
        {visibleChildren.map((child, index) => (
          <span key={index} className="relative z-[calc(100-_index)]">
            {child}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className={cn("flex items-center justify-center bg-neutral-100 text-neutral-600 font-medium border-2 border-white", sizeStyles[size], "rounded-full")}>
            +{remainingCount}
          </span>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";