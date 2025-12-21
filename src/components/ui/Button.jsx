import React from "react";
import { motion } from "framer-motion";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  gradient: "btn-gradient",
};

const sizes = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
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
  const baseClasses = `btn ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${disabled || loading ? "disabled" : ""}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {loading ? (
        <span className="spinner" style={{ width: 20, height: 20 }} />
      ) : (
        <>
          {icon && iconPosition === "start" && (
            <span className="btn-icon-wrapper">{icon}</span>
          )}
          {children}
          {icon && iconPosition === "end" && (
            <span className="btn-icon-wrapper">{icon}</span>
          )}
        </>
      )}
    </motion.button>
  );
}
