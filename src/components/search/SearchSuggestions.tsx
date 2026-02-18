import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Loader2 } from 'lucide-react';
import { Event } from '@/types/events';
import { cn } from '@/lib/utils';

interface SearchSuggestionsProps {
  suggestions: Event[];
  isLoading: boolean;
  isVisible: boolean;
  onSelect: (event: Event) => void;
  onClose: () => void;
  searchQuery: string;
  className?: string;
}

export function SearchSuggestions({
  suggestions,
  isLoading,
  isVisible,
  onSelect,
  onClose,
  searchQuery,
  className,
}: SearchSuggestionsProps) {
  const navigate = useNavigate();

  if (!isVisible || searchQuery.length < 2) {
    return null;
  }

  const handleSelect = (event: Event) => {
    onSelect(event);
    navigate(`/evento/${event.id}`);
    onClose();
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      });
    } catch {
      return '';
    }
  };

  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-border/50 overflow-hidden z-50 max-h-[400px] overflow-y-auto",
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Buscando eventos...</span>
        </div>
      ) : suggestions.length > 0 ? (
        <ul className="py-1" role="listbox">
          {suggestions.map((event, index) => (
            <li key={event.id}>
              <button
                onClick={() => handleSelect(event)}
                className={cn(
                  "w-full px-4 py-3 flex items-start gap-3 hover:bg-accent/50 transition-colors text-left",
                  "focus:outline-none focus:bg-accent/50",
                  index !== suggestions.length - 1 && "border-b border-border/30"
                )}
                role="option"
              >
                {/* Event Image */}
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <img
                    src={event.coverImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Event Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground truncate">
                    {event.name}
                  </h4>
                  <div className="flex flex-col gap-0.5 mt-1">
                    {event.dates[0] && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>{formatDate(event.dates[0].date)}</span>
                        {event.dates[0].time && (
                          <span className="text-muted-foreground/70">• {event.dates[0].time}</span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium shrink-0">
                  {event.category}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          <p className="text-sm">Nenhum evento encontrado</p>
          <p className="text-xs mt-1">Tente buscar por outro termo</p>
        </div>
      )}
    </div>
  );
}
