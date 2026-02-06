import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'white' | 'glass' | 'colored';
  className?: string;
}

export const ClayCard: React.FC<ClayCardProps> = ({ children, variant = 'white', className, ...props }) => {
  const baseStyles = "rounded-3xl p-6 transition-all duration-300";
  
  const variants = {
    white: "bg-white shadow-clay-card",
    glass: "bg-white/40 backdrop-blur-md border border-white/50 shadow-glass",
    colored: "bg-lilac-100 shadow-clay-card"
  };

  return (
    <div className={twMerge(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
};
