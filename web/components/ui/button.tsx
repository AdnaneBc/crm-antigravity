import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const variantClasses = {
  default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
  destructive: "bg-red-500 text-white hover:bg-red-600",
  outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-900",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  ghost: "hover:bg-slate-100 text-slate-700",
  link: "text-blue-600 underline-offset-4 hover:underline p-0",
};

const sizeClasses = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-xs rounded-md",
  lg: "h-10 px-8 text-base",
  icon: "h-9 w-9 p-0",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
