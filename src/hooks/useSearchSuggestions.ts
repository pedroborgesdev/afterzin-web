import { useState, useEffect, useMemo, useCallback } from 'react';
import { useEvents } from './useEvents';
import { Event } from '@/types/events';

interface UseSearchSuggestionsOptions {
  debounceMs?: number;
  maxResults?: number;
}

interface UseSearchSuggestionsReturn {
  suggestions: Event[];
  isLoading: boolean;
  debouncedQuery: string;
}

export function useSearchSuggestions(
  query: string,
  options: UseSearchSuggestionsOptions = {}
): UseSearchSuggestionsReturn {
  const { debounceMs = 300, maxResults = 6 } = options;
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Debounce the search query
  useEffect(() => {
    if (query.length === 0) {
      setDebouncedQuery('');
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsDebouncing(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Fetch all events (will be cached by react-query)
  const { events, isLoading: isLoadingEvents } = useEvents();

  // Filter events based on debounced query
  const suggestions = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      return [];
    }

    const normalizedQuery = debouncedQuery.toLowerCase().trim();

    return events
      .filter((event) => {
        const nameMatch = event.name.toLowerCase().includes(normalizedQuery);
        const locationMatch = event.location.toLowerCase().includes(normalizedQuery);
        const categoryMatch = event.category.toLowerCase().includes(normalizedQuery);
        return nameMatch || locationMatch || categoryMatch;
      })
      .slice(0, maxResults);
  }, [events, debouncedQuery, maxResults]);

  const isLoading = isDebouncing || (debouncedQuery.length >= 2 && isLoadingEvents);

  return {
    suggestions,
    isLoading,
    debouncedQuery,
  };
}
