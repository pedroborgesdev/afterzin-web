import { type EventSaleStatus, getEventSaleStatus } from '@/hooks/useHomeEvents';
import { type Event } from '@/types/events';
import { cn } from '@/lib/utils';

const statusConfig: Record<EventSaleStatus, { label: string; className: string } | null> = {
  esgotado: {
    label: 'Esgotado',
    className: 'bg-muted text-muted-foreground',
  },
  ultimos: {
    label: 'Últimos ingressos',
    className: 'bg-destructive text-destructive-foreground animate-pulse',
  },
  esgotando: {
    label: 'Esgotando',
    className: 'bg-orange-500 text-white',
  },
  novo: {
    label: 'Novo',
    className: 'bg-emerald-500 text-white',
  },
  ativo: null, // Sem badge para status normal
};

interface EventStatusBadgeProps {
  event: Event;
  className?: string;
  /** Mostrar badge "Novo" para eventos recentes */
  showNew?: boolean;
}

/**
 * Badge de status do evento baseado nas regras de negócio.
 * Exibe: "Últimos ingressos", "Esgotando", "Esgotado" ou "Novo".
 * Não renderiza nada quando o evento está com status normal ("ativo").
 */
export function EventStatusBadge({ event, className, showNew = false }: EventStatusBadgeProps) {
  let status = getEventSaleStatus(event);

  // Mostrar "Novo" apenas se solicitado e o evento está ativo sem urgência
  if (status === 'ativo' && showNew) {
    status = 'novo';
  }

  const config = statusConfig[status];
  if (!config) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold leading-tight',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
