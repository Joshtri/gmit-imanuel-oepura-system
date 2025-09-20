import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  variant: {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    destructive: "bg-destructive text-white shadow hover:bg-destructive/90",
    outline:
      "border border-input bg-background shadow hover:bg-accent hover:text-accent-foreground",
    secondary:
      "bg-secondary text-secondary-foreground shadow hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  },
  size: {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
  },
};

function Button({
  className,
  variant = "default",
  size = "default",
  href,
  children,
  ...props
}) {
  const variantClass =
    buttonVariants.variant[variant] || buttonVariants.variant.default;
  const sizeClass = buttonVariants.size[size] || buttonVariants.size.default;

  const baseClassName = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    variantClass,
    sizeClass,
    className
  );

  if (href) {
    return (
      <a
        href={href}
        className={baseClassName}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={baseClassName}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button };
