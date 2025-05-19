
import { cn } from "@/lib/utils";
import React from "react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: string;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "h-4 w-4", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("animate-spin rounded-full border-2 border-t-transparent", size, className)}
        {...props}
      />
    );
  }
);
Spinner.displayName = "Spinner";
