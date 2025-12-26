import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const getVariantClasses = (variant) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-md hover:shadow-lg",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-gray-300 shadow-sm",
    gradient:
      "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg",
  };
  return variants[variant] || variants.primary;
};

const getSizeClasses = (size) => {
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3",
    lg: "px-6 py-4 text-lg",
  };
  return sizes[size] || sizes.md;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "start",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) {
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    rounded-xl font-semibold
    transition-all duration-200
    focus:outline-none focus:ring-4 focus:ring-teal-100
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variantClasses}
    ${sizeClasses}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {icon && iconPosition === "start" && (
            <span className="inline-flex">{icon}</span>
          )}
          {children}
          {icon && iconPosition === "end" && (
            <span className="inline-flex">{icon}</span>
          )}
        </>
      )}
    </motion.button>
  );
}
