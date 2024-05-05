import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "twinline-flex twitems-center twjustify-center twwhitespace-nowrap twrounded-md twtext-sm twfont-medium twring-offset-background twtransition-colors focus-visible:twoutline-none focus-visible:twring-2 focus-visible:twring-ring focus-visible:twring-offset-2 disabled:twpointer-events-none disabled:twopacity-50",
  {
    variants: {
      variant: {
        default: "twbg-primary twtext-primary-foreground hover:twbg-primary/90",
        destructive:
          "twbg-destructive twtext-destructive-foreground hover:twbg-destructive/90",
        outline:
          "twborder twborder-input twbg-background hover:twbg-accent hover:twtext-accent-foreground",
        secondary:
          "twbg-secondary twtext-secondary-foreground hover:twbg-secondary/80",
        ghost: "hover:twbg-accent hover:twtext-accent-foreground",
        link: "twtext-primary twunderline-offset-4 hover:twunderline",
      },
      size: {
        default: "twh-10 twpx-4 twpy-2",
        sm: "twh-9 twrounded-md twpx-3",
        lg: "twh-11 twrounded-md twpx-8",
        icon: "twh-10 tww-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
