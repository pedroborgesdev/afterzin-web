import { Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Event } from '@/types/events';
import { EventStatusBadge } from './EventStatusBadge';

interface EventCardCompactProps {
  event: Event;
  /** Mostrar badge "Novo" */
  showNew?: boolean;
}

/**
 * Card compacto de evento para seções horizontais.
 * Exibe: imagem, status badge, nome, data, local, preço.
 * Largura fixa para scroll horizontal.
 */
export function EventCardCompact({ event, showNew = false }: EventCardCompactProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const getLowestPrice = () => {
    let lowest = Infinity;
    for (const ticket of event.currentLot.tickets) {
      for (const v of ticket.variants) {
        if (v.price < lowest && v.available > 0) lowest = v.price;
      }
    }
    return lowest === Infinity ? 0 : lowest;
  };

  const nextDate = event.dates[0];

  return (
    <Link
      to={`/evento/${event.id}`}
      className="group block w-[220px] sm:w-[260px] shrink-0 snap-start"
    >
      <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-card shadow-card hover-lift h-full">
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <img
            src={event.coverImage}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex gap-1.5">
            <EventStatusBadge event={event} showNew={showNew} />
          </div>
        </div>

        {/* Content */}
        <div className="p-2.5 sm:p-3">
          <h3 className="font-display text-sm sm:text-base font-bold line-clamp-1 mb-1.5">
            {event.name}
          </h3>

          <div className="flex flex-col gap-0.5 text-[11px] sm:text-xs text-muted-foreground mb-2">
            {nextDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 shrink-0" />
                <span>{formatDate(nextDate.date)}{nextDate.time && ` · ${nextDate.time}`}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-muted-foreground text-[10px]">A partir de</span>
              <p className="text-sm sm:text-base font-bold text-primary">
                R$ {getLowestPrice().toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
