import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "neutral";
  className?: string;
}

export function Badge({ children, variant = "primary", className = "" }: BadgeProps) {
  const variantStyles = {
    primary: "bg-teal-50 text-teal-800 border-teal-200",
    accent: "bg-amber-50 text-amber-900 border-amber-200",
    neutral: "bg-neutral-100 text-neutral-800 border-neutral-200",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
}
