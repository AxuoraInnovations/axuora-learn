import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer group whitespace-nowrap focus-visible:outline-none inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:bg-primary/90 shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
        outline:
          "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100",
        ghost: "hover:bg-white/10 text-white",
        link: "text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 rounded-md px-4 py-2 gap-1.5 [&_svg:not([class*=size-])]:size-4",
        sm: "h-9 rounded-md px-3 gap-1.25 text-xs [&_svg:not([class*=size-])]:size-3.5",
        lg: "h-10 rounded-md px-4 text-sm gap-1.5 [&_svg:not([class*=size-])]:size-4",
        icon: "size-10 rounded-md [&_svg:not([class*=size-])]:size-4 shrink-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const computedClassName = cn(buttonVariants({ variant, size }), className);
    if (asChild && React.isValidElement(props.children)) {
      const child = props.children as React.ReactElement<{ className?: string }>;
      const { children: _childChildren, ...restProps } = props;
      return React.cloneElement(child, {
        ...child.props,
        ...restProps,
        className: cn(computedClassName, child.props?.className),
      });
    }
    return (
      <button
        className={computedClassName}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
