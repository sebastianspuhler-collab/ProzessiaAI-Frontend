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
      className={`bg-white border border-[#E5E7EB] rounded-[10px] p-4 transition-all duration-150 shadow-[0.25px_1px_3px_0px_rgba(79,70,229,0.07)] ${
        onClick ? 'cursor-pointer hover:shadow-[0.25px_2px_8px_0px_rgba(79,70,229,0.10)] hover:border-[#C7D2FE]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
