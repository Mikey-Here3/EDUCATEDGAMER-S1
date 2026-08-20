import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TeamStatus } from '@/types';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | TeamStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status?.toLowerCase() || 'pending';
  
  let colorClass = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  let dotColor = 'bg-yellow-500';

  if (normalizedStatus === 'approved') {
    colorClass = 'bg-green-500/10 text-green-500 border-green-500/20';
    dotColor = 'bg-green-500';
  } else if (normalizedStatus === 'rejected') {
    colorClass = 'bg-red-500/10 text-red-500 border-red-500/20';
    dotColor = 'bg-red-500';
  } else if (normalizedStatus === 'cancelled') {
    colorClass = 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    dotColor = 'bg-gray-400';
  }

  return (
    <Badge 
      variant="outline" 
      className={cn('uppercase font-semibold tracking-wider flex items-center gap-1.5 px-2.5 py-0.5', colorClass, className)}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]', dotColor)} />
      {normalizedStatus}
    </Badge>
  );
}

export default StatusBadge;
