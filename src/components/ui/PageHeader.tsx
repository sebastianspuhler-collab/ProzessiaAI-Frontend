import type { ReactNode } from 'react';

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-7 py-5 bg-white border-b border-[#E4E4E7]">
      <div>
        <h1 className="text-[17px] font-semibold tracking-[-0.01em] text-[#09090B]">{title}</h1>
        {subtitle && <p className="text-[13px] text-[#52525B] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
