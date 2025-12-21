import React from "react";

const variants = {
  default: "badge",
  primary: "badge badge-primary",
  success: "badge badge-success",
  warning: "badge badge-warning",
  danger: "badge badge-danger",
};

export default function Badge({
  children,
  variant = "default",
  icon,
  className = "",
}) {
  return (
    <span className={`${variants[variant]} ${className}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}
