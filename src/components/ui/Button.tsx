import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export function Button({
  children,
  variant = 'secondary',
  onClick,
  disabled,
  loading,
  className = '',
  size = 'md',
  type = 'button',
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  size?: 'sm' | 'md';
  type?: 'button' | 'submit';
}) {
  const base =
    'inline-flex items-center gap-1.5 font-medium rounded-[7px] transition-all duration-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-2.5 py-1 text-[12px]', md: 'px-3 py-1.5 text-[13px]' };
  const variants: Record<ButtonVariant, string> = {
    primary:   'bg-[#4F46E5] text-white hover:bg-[#4338CA]',
    secondary: 'bg-white border border-[#E5E7EB] text-[#111827] hover:bg-[#F9FAFB]',
    ghost:     'bg-transparent text-[#6B7280] hover:bg-[#F9FAFB]',
    danger:    'bg-white border border-red-200 text-red-600 hover:bg-red-50',
  };
  return (
    <button
      type={type}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled ?? loading}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
