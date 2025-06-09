import React from 'react';

export function Button({ children, className = '', variant = 'default', ...props }) {
  let variantClass = '';

  switch (variant) {
    case 'destructive':
      variantClass = 'bg-red-600 text-white hover:bg-red-700';
      break;
    case 'outline':
      variantClass = 'border border-gray-300 text-gray-700 hover:bg-gray-100';
      break;
    case 'default':
    default:
      variantClass = 'bg-blue-600 text-white hover:bg-blue-700';
      break;
  }

  const baseClasses =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2';

  return (
    <button
      className={`${baseClasses} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
