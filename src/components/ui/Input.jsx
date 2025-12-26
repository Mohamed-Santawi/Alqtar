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
      <div className={`mb-4 ${className}`}>
        {label && (
          <label
            className="block text-sm font-semibold text-gray-700 mb-2"
            dir="rtl"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === "start" && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            className={`w-full px-4 py-3.5 ${
              icon && iconPosition === "start" ? "pr-12" : ""
            } ${icon && iconPosition === "end" ? "pl-12" : ""}
            border-2 ${
              error
                ? "border-red-500 focus:border-red-600"
                : "border-gray-200 focus:border-teal-500"
            }
            rounded-xl bg-white text-gray-800 placeholder-gray-400
            focus:outline-none focus:ring-4 ${
              error ? "focus:ring-red-100" : "focus:ring-teal-100"
            }
            transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed`}
            {...props}
          />
          {icon && iconPosition === "end" && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </span>
          )}
        </div>
        {error && <p className="text-sm text-red-500 mt-1.5">{error}</p>}
        {helper && !error && (
          <p className="text-sm text-gray-500 mt-1.5">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
