import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'surface';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className,
}: BadgeProps) {
  const variants = {
    primary: 'bg-primary-100 text-primary-700',
    accent: 'bg-accent-100 text-accent-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    surface: 'bg-surface-100 text-surface-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// Status Badge for submission statuses
interface StatusBadgeProps {
  status: 'draft' | 'pending' | 'under_review' | 'accepted' | 'rejected' | 'revision_requested';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    draft: { label: 'Draft', variant: 'surface' as const },
    pending: { label: 'Pending', variant: 'warning' as const },
    under_review: { label: 'Under Review', variant: 'primary' as const },
    accepted: { label: 'Accepted', variant: 'success' as const },
    rejected: { label: 'Rejected', variant: 'error' as const },
    revision_requested: { label: 'Revision Requested', variant: 'accent' as const },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={className}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {config.label}
    </Badge>
  );
}
