import React from "react";
import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  variant = "default",
  hover = true,
  padding = "xl",
  onClick,
  ...props
}) {
  const paddingClasses = {
    sm: "p-sm",
    md: "p-md",
    lg: "p-lg",
    xl: "p-xl",
  };

  const variantClasses = {
    default: "card",
    gradient: "card card-gradient",
    accent: "card card-accent",
    glass: "card glass",
  };

  return (
    <motion.div
      className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      onClick={onClick}
      whileHover={hover ? { y: -4, boxShadow: "var(--shadow-lg)" } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
