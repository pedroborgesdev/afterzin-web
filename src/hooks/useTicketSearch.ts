import { useMemo, useState, useDeferredValue } from 'react';

interface Ticket {
  id: string;
  eventId: string;
  eventName: string;
  eventImage: string;
  ticketType: string;
  date: string;
  time: string;
  location: string;
  qrCode: string;
  holderName: string;
  holderCpf: string;
  purchaseDate: string;
}

/**
 * Normaliza texto removendo acentos e convertendo para minúsculo.
 * Permite buscas case-insensitive e tolerantes a acentos.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Formata data ISO para exibição pt-BR (para busca por texto de data).
 */
function formatDateForSearch(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Determina o status de um ticket com base na data do evento.
 */
function getTicketStatus(ticket: Ticket): string {
  if (!ticket.date) return 'ativo';
  const eventDate = new Date(ticket.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today ? 'expirado' : 'ativo';
}

/**
 * Hook para pesquisa dinâmica de tickets.
 * Filtra tickets por: nome do evento, data, local, código, tipo e status.
 * Case-insensitive e tolerante a acentos.
 * Usa useDeferredValue para não bloquear a digitação.
 */
export function useTicketSearch(tickets: Ticket[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredQuery = useDeferredValue(searchQuery);

  const filteredTickets = useMemo(() => {
    const trimmed = deferredQuery.trim();
    if (!trimmed) return tickets;

    const normalizedQuery = normalize(trimmed);
    const terms = normalizedQuery.split(/\s+/).filter(Boolean);

    return tickets.filter((ticket) => {
      // Build searchable text from all relevant fields
      const searchableFields = [
        ticket.eventName,
        ticket.location,
        ticket.ticketType,
        ticket.qrCode,
        ticket.holderName,
        ticket.date,
        ticket.time,
        formatDateForSearch(ticket.date),
        getTicketStatus(ticket),
      ];

      const normalizedText = normalize(searchableFields.join(' '));

      // All terms must match (AND logic)
      return terms.every((term) => normalizedText.includes(term));
    });
  }, [tickets, deferredQuery]);

  const clearSearch = () => setSearchQuery('');

  return {
    searchQuery,
    setSearchQuery,
    filteredTickets,
    clearSearch,
    isFiltering: deferredQuery.trim().length > 0,
    hasResults: filteredTickets.length > 0,
  };
}
