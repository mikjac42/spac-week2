import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  title?: string;
}

/**
 * Generic action button component for player actions (hit, stand, double, etc.)
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  children,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  className = '',
  title
}) => {
  // Base button styles
  const baseClasses = `
    font-bold
    rounded-lg
    border-2
    transition-all
    duration-200
    ease-in-out

    active:scale-95
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:transform-none
    shadow-lg
    hover:shadow-lg
  `;

  // Variant styles
  const variantClasses = {
    primary: `
      bg-blue-600
      hover:bg-blue-700
      border-blue-700
      text-white
      shadow-blue-500/25
      hover:shadow-blue-500/40
    `,
    secondary: `
      bg-gray-600
      hover:bg-gray-700
      border-gray-700
      text-white
      shadow-gray-500/25
      hover:shadow-gray-500/40
    `,
    danger: `
      bg-red-600
      hover:bg-red-700
      border-red-700
      text-white
      shadow-red-500/25
      hover:shadow-red-500/40
    `,
    success: `
      bg-green-600
      hover:bg-green-700
      border-green-700
      text-white
      shadow-green-500/25
      hover:shadow-green-500/40
    `
  };

  // Size styles
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-6 py-3 text-base min-w-[120px]',
    large: 'px-8 py-4 text-lg min-w-[160px]'
  };

  // Disabled styles
  const disabledClasses = disabled ? `
    bg-gray-400
    border-gray-500
    text-gray-200
    cursor-not-allowed
    hover:bg-gray-400
    hover:shadow-lg
  ` : '';

  const buttonClasses = `
    ${baseClasses}
    ${disabled ? disabledClasses : variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
};