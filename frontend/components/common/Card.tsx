import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass" | "gradient";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  variant = "default",
  padding = "md",
  hoverable = false,
  onClick,
}: CardProps) {
  const baseStyles = "rounded-md border transition-all duration-200";

  const variants = {
    default: "bg-white dark:bg-card border-gray-200 dark:border-gray-700",
    glass:
      "bg-white/80 dark:bg-gray-800/30 backdrop-blur-xl border-gray-200 dark:border-gray-700/50",
    gradient:
      "bg-gradient-to-br from-primary-green/10 to-primary-green-light/10 border-primary-green/30",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverStyles = hoverable
    ? "cursor-pointer hover:border-primary-green/50 hover:shadow-lg hover:shadow-primary-green/20"
    : "";

  return (
    <div
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${paddings[padding]}
        ${hoverStyles}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
