import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const enhancedButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover-lift hover-glow perspective-1000 preserve-3d",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-red hover-gradient",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover-shake",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover-3d hover-magnetic",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover-bounce",
        ghost: "hover:bg-accent hover:text-accent-foreground hover-pulse",
        link: "text-primary underline-offset-4 hover:underline hover-slide",
        "3d": "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-red hover-lift hover-glow hover-gradient transform-gpu",
        magnetic: "bg-primary text-primary-foreground hover:bg-primary/90 hover-magnetic hover-glow",
        flip: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover-flip preserve-3d",
        rotate: "bg-accent text-accent-foreground hover:bg-accent/80 hover-rotate",
        slide: "bg-primary text-primary-foreground hover:bg-primary/90 hover-slide overflow-hidden",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-12 text-lg",
        icon: "h-10 w-10",
      },
      animation: {
        none: "",
        bounce: "hover-bounce",
        shake: "hover-shake",
        pulse: "hover-pulse",
        glow: "hover-glow",
        lift: "hover-lift",
        "3d": "hover-3d",
        magnetic: "hover-magnetic",
        flip: "hover-flip",
        rotate: "hover-rotate",
        slide: "hover-slide",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "lift",
    },
  }
)

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean
  glowColor?: string
  particleEffect?: boolean
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, variant, size, animation, asChild = false, glowColor, particleEffect, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const [isHovered, setIsHovered] = React.useState(false)

    const handleMouseEnter = () => {
      setIsHovered(true)
      if (particleEffect) {
        // Create particle effect on hover
        createParticleEffect()
      }
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
    }

    const createParticleEffect = () => {
      // Simple particle effect implementation
      const particles = []
      for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        particle.style.position = 'absolute'
        particle.style.width = '4px'
        particle.style.height = '4px'
        particle.style.background = glowColor || 'rgba(229, 9, 20, 0.6)'
        particle.style.borderRadius = '50%'
        particle.style.pointerEvents = 'none'
        particle.style.animation = 'particle 1s ease-out forwards'
        document.body.appendChild(particle)
        
        setTimeout(() => {
          document.body.removeChild(particle)
        }, 1000)
      }
    }

    return (
      <Comp
        className={cn(enhancedButtonVariants({ variant, size, animation, className }))}
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          '--glow-color': glowColor || 'rgba(229, 9, 20, 0.6)',
        } as React.CSSProperties}
        {...props}
      >
        {children}
        {isHovered && variant === "3d" && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-md animate-slide-in-right" />
        )}
      </Comp>
    )
  }
)
EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton, enhancedButtonVariants }