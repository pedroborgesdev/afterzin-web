import { ArrowDown, Sparkles } from 'lucide-react';

interface EventEndCardProps {
  onViewAll: () => void;
}

/**
 * Card final do carrossel que indica fim da lista e oferece navegação para todos os eventos.
 */
export function EventEndCard({ onViewAll }: EventEndCardProps) {
  return (
    <button
      onClick={onViewAll}
      className="group block w-[220px] sm:w-[260px] shrink-0 snap-start"
    >
      <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all duration-300 h-full min-h-[280px] sm:min-h-[320px] flex flex-col items-center justify-center p-6 hover-lift">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
        </div>
        
        <h3 className="font-display text-base sm:text-lg font-bold text-center mb-2">
          Você chegou ao fim
        </h3>
        
        <p className="text-xs sm:text-sm text-muted-foreground text-center mb-4">
          Explore mais eventos incríveis
        </p>
        
        <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
          <span>Ver todos os eventos</span>
          <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </div>
      </div>
    </button>
  );
}
