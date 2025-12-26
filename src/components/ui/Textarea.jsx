import React, { forwardRef } from "react";

const Textarea = forwardRef(
  ({ label, error, helper, className = "", rows = 4, ...props }, ref) => {
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
        <textarea
          ref={ref}
          rows={rows}
          className={`w-full px-4 py-3.5 border-2 ${
            error
              ? "border-red-500 focus:border-red-600"
              : "border-gray-200 focus:border-teal-500"
          } rounded-xl bg-white text-gray-800 placeholder-gray-400
          focus:outline-none focus:ring-4 ${
            error ? "focus:ring-red-100" : "focus:ring-teal-100"
          }
          transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed resize-y min-h-[100px]`}
          {...props}
        />
        {error && <p className="text-sm text-red-500 mt-1.5">{error}</p>}
        {helper && !error && (
          <p className="text-sm text-gray-500 mt-1.5">{helper}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
