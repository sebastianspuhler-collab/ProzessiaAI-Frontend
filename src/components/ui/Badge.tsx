type BadgeVariant = 'active' | 'paused' | 'draft' | 'error' | 'demo' | 'default';

const styles: Record<BadgeVariant, string> = {
  active:  'bg-green-50 text-green-700',
  paused:  'bg-yellow-50 text-yellow-700',
  draft:   'bg-[#F3F4F6] text-[#6B7280]',
  error:   'bg-red-50 text-red-600',
  demo:    'bg-[#EEF2FF] text-[#4F46E5]',
  default: 'bg-[#F3F4F6] text-[#6B7280]',
};

export function Badge({ label, variant = 'default' }: { label: string; variant?: BadgeVariant }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${styles[variant]}`}>
      {label}
    </span>
  );
}
