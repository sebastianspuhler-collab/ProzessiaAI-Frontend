import type { ReactNode } from 'react';

export function Card({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E4E4E7] rounded-[10px] p-4 transition-all duration-150 shadow-sm ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-[#D1D1D6]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
