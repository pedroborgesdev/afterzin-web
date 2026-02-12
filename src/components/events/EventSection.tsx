import { useRef, useState, useEffect, useLayoutEffect, useCallback, type ReactNode, Children } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventSectionProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  /** Se true, renderiza os children em scroll horizontal */
  horizontal?: boolean;
  /** Se true, ativa o modo carrossel infinito (loop contínuo) */
  infinite?: boolean;
  /** Card a ser exibido no final do carrossel (apenas uma vez) */
  endCard?: ReactNode;
  className?: string;
}

/**
 * Seção reutilizável da Home para agrupar eventos.
 * Suporta layout horizontal (scroll snap) ou layout livre (grid).
 * Inclui navegação por setas no desktop e scroll touch no mobile.
 * Modo infinito: replica o conteúdo 11x (5 antes + 1 centro + 5 depois) para navegação contínua.
 * Ativação inteligente: infinito só ativa com >=10 eventos (desktop) ou >=4 eventos (mobile).
 */
export function EventSection({ title, subtitle, icon, children, horizontal = false, infinite = false, endCard, className }: EventSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isRepositioningRef = useRef(false);

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768); // md breakpoint
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Para carrossel infinito, replicar children dinamicamente baseado na quantidade
  const childrenArray = Children.toArray(children);
  
  // Verificar se deve ativar modo infinito baseado na quantidade de eventos
  const minEventsForInfinite = isMobile ? 4 : 10;
  const shouldBeInfinite = infinite && childrenArray.length >= minEventsForInfinite;
  
  // Calcular número de repetições baseado na quantidade de eventos
  const getRepetitionCount = (count: number): number => {
    if (count <= 5) return 5;
    if (count <= 10) return 3;
    return 2;
  };
  
  const repetitions = getRepetitionCount(childrenArray.length);
  
  const displayChildren = shouldBeInfinite
    ? [
        ...childrenArray.map((child, i) => ({ child, key: `original-${i}` })),
        ...Array.from({ length: repetitions }, (_, repIndex) =>
          childrenArray.map((child, i) => ({ child, key: `rep${repIndex + 1}-${i}` }))
        ).flat(),
      ].map(({ child, key }) => {
        if (typeof child === 'object' && child !== null && 'type' in child) {
          return { ...child, key };
        }
        return child;
      })
    : childrenArray;

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    if (shouldBeInfinite) {
      // No modo infinito, sempre mostrar ambas as setas
      setCanScrollLeft(true);
      setCanScrollRight(true);
    } else {
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    }
  }, [shouldBeInfinite]);

  // Reposicionamento instantâneo para carrossel infinito (apenas ao chegar no fim)
  // Se houver endCard, não reposiciona para permitir que usuário chegue ao final
  const handleInfiniteScroll = useCallback(() => {
    if (!shouldBeInfinite || isRepositioningRef.current || endCard) return;
    const el = scrollRef.current;
    if (!el || childrenArray.length === 0) return;

    const cardWidth = el.querySelector(':scope > *')?.clientWidth ?? 280;
    const gap = 16; // gap-4 = 16px (sm:gap-5 = 20px, mas vamos usar 16 como base)
    const itemWidth = cardWidth + gap;
    const totalOriginalWidth = childrenArray.length * itemWidth;
    const reps = getRepetitionCount(childrenArray.length);
    
    // Threshold: quando chegar perto do fim da última repetição, voltar para lista original
    const endThreshold = reps * totalOriginalWidth;
    
    // Se chegou perto do fim, reposicionar para o início da lista original
    if (el.scrollLeft >= endThreshold) {
      isRepositioningRef.current = true;
      const offset = el.scrollLeft % totalOriginalWidth;
      el.scrollLeft = offset;
      requestAnimationFrame(() => {
        isRepositioningRef.current = false;
      });
    }
  }, [shouldBeInfinite, childrenArray.length, endCard]);

  useLayoutEffect(() => {
    if (!horizontal) return;
    const el = scrollRef.current;
    if (!el) return;

    // Corrigir scroll inicial para o início da lista original no modo infinito
    if (shouldBeInfinite && childrenArray.length > 0) {
      const cardWidth = el.querySelector(':scope > *')?.clientWidth ?? 280;
      const gap = 16;
      const itemWidth = cardWidth + gap;
      // O início da lista original é após as repetições anteriores
      const reps = getRepetitionCount(childrenArray.length);
      // Se houver repetições antes, posicione o scroll no início da lista original
      el.scrollLeft = 0;
    } else {
      el.scrollLeft = 0;
    }

    updateScrollState();

    const handleScroll = () => {
      updateScrollState();
      handleInfiniteScroll();
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', handleScroll);
      ro.disconnect();
    };
  }, [horizontal, shouldBeInfinite, childrenArray.length, isMobile, updateScrollState, handleInfiniteScroll]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector(':scope > *')?.clientWidth ?? 280;
    el.scrollBy({ left: direction === 'left' ? -cardWidth - 16 : cardWidth + 16, behavior: 'smooth' });
  };

  return (
    <section className={cn('', className)}>
      {/* Section Header */}
      <div className="container flex items-center mb-4 sm:mb-5">
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-xl sm:text-2xl">{icon}</span>}
          <div>
            <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold leading-tight">{title}</h2>
            {subtitle && <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Content */}
      {horizontal ? (
        <>
          <div
            ref={scrollRef}
            className={cn(
              "flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide snap-x-mandatory px-4 sm:px-6 py-2 sm:py-2",
              !canScrollLeft && !canScrollRight && "justify-center"
            )}
            style={{ scrollPaddingLeft: '1rem' }}
          >
            {displayChildren}
            {endCard}
          </div>

          {/* Navigation arrows — below carousel, centered */}
          {(canScrollLeft || canScrollRight) && (
            <div className="flex items-center justify-center gap-3 mt-4 sm:mt-5">
              <button
                onClick={() => scroll('left')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 min-h-touch min-w-touch bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-95"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 min-h-touch min-w-touch bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-95"
                aria-label="Próximo"
              >
                <ChevronRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="container">{children}</div>
      )}
    </section>
  );
}
