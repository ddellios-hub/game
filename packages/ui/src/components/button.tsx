import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
        outline: "border border-primary text-primary hover:bg-primary/10 focus-visible:ring-primary",
        ghost: "text-primary hover:bg-primary/10 focus-visible:ring-primary"
      },
      size: {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
}

export function Button({ asChild = false, className, icon, children, variant, size, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={clsx(buttonVariants({ variant, size }), icon && "gap-2", className)} {...props}>
      {icon}
      {children}
    </Comp>
  );
}
