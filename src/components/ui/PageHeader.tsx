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
    <div className="flex items-center justify-between px-7 py-5 bg-white border-b border-[#E5E7EB]">
      <div>
        <h1 className="text-[17px] font-semibold tracking-[-0.01em] text-[#111827]">{title}</h1>
        {subtitle && <p className="text-[13px] text-[#6B7280] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
