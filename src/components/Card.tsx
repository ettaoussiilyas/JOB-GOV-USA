import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Card({ children, className = "", as: Component = "div" }: CardProps) {
  return (
    <Component
      className={`rounded-xl border border-neutral-200 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </Component>
  );
}
