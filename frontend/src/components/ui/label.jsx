import React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/utils";

// Définition des variantes du label
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

// Composant Label en JSX
const Label = ({ className, children, ...props }) => {
  return (
    <LabelPrimitive.Root className={cn(labelVariants(), className)} {...props}>
      {children}
    </LabelPrimitive.Root>
  );
};

export { Label };
