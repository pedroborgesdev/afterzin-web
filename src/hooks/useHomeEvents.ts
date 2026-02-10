import { useMemo } from 'react';
import { type Event } from '@/types/events';

/**
 * Determina o status de venda de um evento com base nos dados do lote ativo.
 * Regras de negócio:
 * - "esgotado": lote sold_out ou ended sem tickets
 * - "ultimos": disponível < 10% do total
 * - "esgotando": disponível < 30% do total
 * - "novo": criado recentemente (primeira data > hoje)
 * - "ativo": padrão
 */
export type EventSaleStatus = 'esgotado' | 'ultimos' | 'esgotando' | 'novo' | 'ativo';

export function getEventSaleStatus(event: Event): EventSaleStatus {
  const lot = event.currentLot;

  if (lot.status === 'sold_out' || lot.status === 'ended') {
    return 'esgotado';
  }

  // Calcula disponibilidade total do lote
  let totalAvailable = 0;
  let totalCapacity = 0;
  for (const ticket of lot.tickets) {
    for (const v of ticket.variants) {
      totalAvailable += v.available;
      totalCapacity += v.total;
    }
  }

  if (totalCapacity === 0) return 'esgotado';

  const ratio = totalAvailable / totalCapacity;
  if (ratio <= 0) return 'esgotado';
  if (ratio <= 0.1) return 'ultimos';
  if (ratio <= 0.3) return 'esgotando';

  return 'ativo';
}

/**
 * Verifica se um evento está ativo (tem datas futuras e ingressos à venda).
 */
export function isEventActive(event: Event): boolean {
  const status = getEventSaleStatus(event);
  if (status === 'esgotado') return false;

  // Tem pelo menos uma data futura
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return event.dates.some((d) => new Date(d.date) >= now);
}

/**
 * Verifica se um evento é "novo" (primeira data é no futuro e foi criado recentemente).
 */
export function isEventNew(event: Event): boolean {
  if (event.dates.length === 0) return false;
  const firstDate = new Date(event.dates[0].date);
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return firstDate > now && firstDate <= thirtyDaysFromNow;
}

/**
 * Obtém a próxima data do evento (mais próxima do hoje).
 * Se não houver data futura, retorna a data mais recente (passada).
 */
function getNextEventDate(event: Event): Date | null {
  if (event.dates.length === 0) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const sorted = event.dates
    .map((d) => new Date(d.date))
    .sort((a, b) => a.getTime() - b.getTime());
  // Prioriza data futura
  const future = sorted.find((d) => d >= now);
  if (future) return future;
  // Fallback: data mais recente (passada)
  return sorted[sorted.length - 1] ?? null;
}

/**
 * Obtém o preço mais baixo de um evento.
 */
function getLowestPrice(event: Event): number {
  let lowest = Infinity;
  for (const ticket of event.currentLot.tickets) {
    for (const v of ticket.variants) {
      if (v.price < lowest && v.available > 0) lowest = v.price;
    }
  }
  return lowest === Infinity ? 0 : lowest;
}

interface HomeEventSections {
  /** Destaques: featured + ativos */
  featured: Event[];
  /** Eventos em alta: com mais vendas (maior % vendido) */
  trending: Event[];
  /** Próximos eventos: ordenados por data mais próxima */
  upcoming: Event[];
  /** Últimos adicionados: eventos novos com visibilidade */
  recent: Event[];
  /** Todos os eventos (sem filtro rígido) para a grid geral */
  all: Event[];
}

/**
 * Hook que organiza os eventos da API em seções orientadas por regras de negócio.
 * Uma única fonte de dados (events), múltiplas visualizações.
 * Sem requisições adicionais. Processamento eficiente com useMemo.
 */
export function useHomeEvents(events: Event[]): HomeEventSections {
  return useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Filtra eventos ativos para seções curadas (têm data futura e ingressos)
    const activeEvents = events.filter(isEventActive);

    // Featured: eventos marcados como destaque — prioriza ativos, mas inclui todos featured se não houver ativos suficientes
    const activeFeatured = activeEvents.filter((e) => e.featured);
    const featured = activeFeatured.length > 0
      ? activeFeatured
      : events.filter((e) => e.featured);

    // Trending: ordenados por % vendida (maior engajamento = mais vendido proporcionalmente)
    // Usa eventos ativos se disponíveis, senão usa todos
    const trendingPool = activeEvents.length > 0 ? activeEvents : events;
    const trending = [...trendingPool]
      .map((event) => {
        let totalSold = 0;
        let totalCapacity = 0;
        for (const ticket of event.currentLot.tickets) {
          for (const v of ticket.variants) {
            totalSold += v.total - v.available;
            totalCapacity += v.total;
          }
        }
        const soldRatio = totalCapacity > 0 ? totalSold / totalCapacity : 0;
        return { event, soldRatio };
      })
      .filter((e) => e.soldRatio > 0) // Apenas com vendas
      .sort((a, b) => b.soldRatio - a.soldRatio)
      .slice(0, 8)
      .map((e) => e.event);

    // Upcoming: próximos eventos por data (apenas com datas futuras)
    const upcomingPool = activeEvents.length > 0 ? activeEvents : events;
    const upcoming = [...upcomingPool]
      .map((event) => ({ event, nextDate: getNextEventDate(event) }))
      .filter((e): e is { event: Event; nextDate: Date } => e.nextDate !== null)
      .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
      .slice(0, 8)
      .map((e) => e.event);

    // Recent: eventos mais recentes (priorizando os que são "novos" — data futura próxima)
    // Heurística: eventos com datas mais distantes do hoje são provavelmente mais recentes
    const recentPool = activeEvents.length > 0 ? activeEvents : events;
    const recent = [...recentPool]
      .filter((e) => !e.featured) // Não repetir destaques
      .map((event) => {
        const nextDate = getNextEventDate(event);
        return { event, nextDate };
      })
      .filter((e): e is { event: Event; nextDate: Date } => e.nextDate !== null)
      .sort((a, b) => b.nextDate.getTime() - a.nextDate.getTime()) // Mais distante primeiro = adicionado mais recentemente
      .slice(0, 8)
      .map((e) => e.event);

    return {
      featured,
      trending,
      upcoming,
      recent,
      all: events, // Grid geral mostra TODOS os eventos da API (ativos e passados com badges)
    };
  }, [events]);
}
