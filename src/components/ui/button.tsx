import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-sm hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-[1.02]",
        outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-[1.02]",
        ghost: "hover:bg-accent hover:text-accent-foreground shadow-none hover:shadow-none",
        link: "text-primary underline-offset-4 hover:underline shadow-none hover:shadow-none",
        hero: "bg-primary text-primary-foreground hover:bg-green-light text-base tracking-wide uppercase hover:scale-[1.03] shadow-md hover:shadow-lg",
        heroOutline: "border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-base tracking-wide uppercase hover:scale-[1.03]",
        gold: "bg-gold text-foreground hover:bg-gold/80 tracking-wide uppercase hover:scale-[1.03] shadow-md hover:shadow-lg",
        wine: "bg-wine text-primary-foreground hover:bg-wine/90 tracking-wide uppercase hover:scale-[1.03] shadow-md hover:shadow-lg",
        whatsapp: "bg-[hsl(var(--whatsapp-green))] text-primary-foreground hover:bg-[hsl(var(--whatsapp-green))]/90 tracking-wide uppercase hover:scale-[1.03] shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-12 px-10",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
