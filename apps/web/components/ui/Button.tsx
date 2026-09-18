"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-primary to-primary-2 text-primary-ink shadow-[0_0_0_rgba(0,240,255,0)] hover:shadow-[0_0_20px_rgba(0,240,255,0.45)] hover:brightness-110 active:scale-[0.98] disabled:hover:shadow-none",
  secondary:
    "bg-surface-1/60 text-primary border border-primary/40 hover:border-primary hover:bg-primary/10 active:scale-[0.98]",
  ghost:
    "bg-transparent text-text-secondary hover:text-white hover:bg-white/5 active:scale-[0.98]",
  danger:
    "bg-error/10 text-error border border-error/30 hover:bg-error/20 active:scale-[0.98]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-base gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", icon, trailingIcon, className = "", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`inline-flex items-center justify-center rounded-lg font-display font-semibold tracking-wide transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {icon}
        {children}
        {trailingIcon}
      </button>
    );
  },
);

Button.displayName = "Button";
