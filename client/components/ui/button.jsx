import React from "react";

export function Button({ variant = "primary", children, ...props }) {
  const base =
    "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 transition-colors";
  const variants = {
    primary: "bg-mindboost-green text-white hover:bg-green-700 focus:ring-green-400",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400",
  };
  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}