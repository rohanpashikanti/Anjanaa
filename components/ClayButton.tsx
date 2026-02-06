import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ClayButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'blue';
  fullWidth?: boolean;
}

export const ClayButton: React.FC<ClayButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className,
  ...props
}) => {
  const baseStyles = "relative rounded-2xl font-display font-bold py-3 px-6 text-lg outline-none select-none transition-colors";

  const variants = {
    primary: "bg-lilac-500 text-white shadow-clay-btn active:shadow-clay-btn-pressed hover:bg-lilac-600",
    secondary: "bg-white text-gray-700 shadow-clay-btn active:shadow-clay-btn-pressed hover:bg-gray-50",
    danger: "bg-red-400 text-white shadow-clay-btn active:shadow-clay-btn-pressed hover:bg-red-500",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 shadow-none",
    blue: "bg-blue-500 text-white shadow-clay-btn active:shadow-clay-btn-pressed hover:bg-blue-600"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={twMerge(baseStyles, variants[variant], fullWidth ? "w-full" : "", className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};