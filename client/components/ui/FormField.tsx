import React from "react";

export function FormField({ label, id, children, ...props }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block font-medium mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}