import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children, className, ...props }) => {
  return (
    <span
      {...props}
      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${className}`}
    >
      {children}
    </span>
  );
};