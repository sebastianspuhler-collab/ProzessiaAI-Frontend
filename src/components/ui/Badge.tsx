type BadgeVariant = 'active' | 'paused' | 'draft' | 'error' | 'demo' | 'default';

const styles: Record<BadgeVariant, string> = {
  active: 'bg-green-50 text-green-700',
  paused: 'bg-yellow-50 text-yellow-700',
  draft: 'bg-zinc-100 text-zinc-500',
  error: 'bg-red-50 text-red-600',
  demo: 'bg-blue-50 text-blue-600',
  default: 'bg-zinc-100 text-zinc-600',
};

export function Badge({ label, variant = 'default' }: { label: string; variant?: BadgeVariant }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${styles[variant]}`}>
      {label}
    </span>
  );
}
