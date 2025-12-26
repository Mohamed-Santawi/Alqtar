import React from "react";
import { motion } from "framer-motion";

const getPaddingClasses = (padding) => {
  const sizes = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };
  return sizes[padding] || sizes.xl;
};

const getVariantClasses = (variant) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-sm",
    gradient:
      "bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 shadow-md",
    accent:
      "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 shadow-md",
    glass: "bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg",
  };
  return variants[variant] || variants.default;
};

export default function Card({
  children,
  className = "",
  variant = "default",
  hover = true,
  padding = "xl",
  onClick,
  ...props
}) {
  const paddingClasses = getPaddingClasses(padding);
  const variantClasses = getVariantClasses(variant);

  return (
    <motion.div
      className={`rounded-2xl transition-all duration-200 ${variantClasses} ${paddingClasses} ${className}`}
      onClick={onClick}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
