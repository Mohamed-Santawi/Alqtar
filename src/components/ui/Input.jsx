import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      error,
      helper,
      icon,
      iconPosition = "start",
      className = "",
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`input-group ${className}`}>
        {label && <label className="input-label">{label}</label>}
        <div className="relative">
          {icon && iconPosition === "start" && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            className={`input ${
              icon && iconPosition === "start" ? "pr-14" : ""
            } ${icon && iconPosition === "end" ? "pl-14" : ""} ${
              error ? "border-red-500" : ""
            }`}
            style={
              icon && iconPosition === "start"
                ? { paddingRight: "48px" }
                : icon && iconPosition === "end"
                ? { paddingLeft: "48px" }
                : {}
            }
            {...props}
          />
          {icon && iconPosition === "end" && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
              {icon}
            </span>
          )}
        </div>
        {error && <p className="text-sm text-red-500 mt-sm">{error}</p>}
        {helper && !error && (
          <p className="text-sm text-muted mt-sm">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
