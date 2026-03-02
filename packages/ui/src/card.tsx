import * as React from "react";
import { cn } from "./utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return <div className={cn("rounded-3xl border border-neutral-200 bg-white shadow-sm", className)} {...props} />;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn("p-6", className)} {...props} />;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}
