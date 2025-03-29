import React from 'react';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({ children, ...props }) => {
  return (
    <div
      {...props}
      style={{ overflowY: 'auto', maxHeight: '100%', ...props.style }}
      className={`scroll-area ${props.className}`}
    >
      {children}
    </div>
  );
};