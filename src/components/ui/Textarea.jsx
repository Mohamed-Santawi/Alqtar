import React, { forwardRef } from "react";

const Textarea = forwardRef(
  ({ label, error, helper, className = "", rows = 4, ...props }, ref) => {
    return (
      <div className={`input-group ${className}`}>
        {label && <label className="input-label">{label}</label>}
        <textarea
          ref={ref}
          rows={rows}
          className={`input textarea ${error ? "border-red-500" : ""}`}
          {...props}
        />
        {error && <p className="text-sm text-red-500 mt-sm">{error}</p>}
        {helper && !error && (
          <p className="text-sm text-muted mt-sm">{helper}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
