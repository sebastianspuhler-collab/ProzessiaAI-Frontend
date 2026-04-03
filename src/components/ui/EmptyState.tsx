import type { ReactNode } from 'react';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#F4F4F5] flex items-center justify-center text-[#A1A1AA] mb-4">
        {icon}
      </div>
      <h3 className="text-[14px] font-semibold text-[#09090B] mb-1">{title}</h3>
      <p className="text-[13px] text-[#52525B] max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
