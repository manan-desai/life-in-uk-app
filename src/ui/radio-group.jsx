// src/ui/radio-group.jsx
import * as React from "react";

export function RadioGroup({ children, className }) {
  return <div className={`space-y-2 ${className || ""}`}>{children}</div>;
}

export function RadioGroupItem({ value, checked, onClick, disabled }) {
  return (
    <button
      type="button"
      className={`
        flex items-center gap-2 p-2 border rounded-full w-full text-left
        ${checked ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}
        ${disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-100"}
        transition-colors
      `}
      onClick={onClick}
      disabled={disabled}
    >
      <div
        className={`
          w-4 h-4 rounded-full border border-gray-400
          ${checked ? "bg-white border-4 border-blue-500" : "bg-white"}
        `}
      ></div>
      <span className="flex-1">{value}</span>
    </button>
  );
}
