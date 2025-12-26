import React from "react";

const getVariantClasses = (variant) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    primary: "bg-teal-100 text-teal-800 border border-teal-200",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
  };
  return variants[variant] || variants.default;
};

export default function Badge({
  children,
  variant = "default",
  icon,
  className = "",
}) {
  const variantClasses = getVariantClasses(variant);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${variantClasses} ${className}`}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </span>
  );
}
