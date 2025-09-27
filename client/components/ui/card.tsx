import React from "react";

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-lg shadow bg-white dark:bg-gray-900 p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`mb-2 font-bold text-lg ${className}`}>{children}</div>;
}
export function CardTitle({ children, className = "" }) {
  return <div className={`text-xl font-semibold ${className}`}>{children}</div>;
}
export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}