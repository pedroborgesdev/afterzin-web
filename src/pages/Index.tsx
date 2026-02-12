import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Search, Flame, CalendarClock, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { FeaturedCarousel } from '@/components/events/FeaturedCarousel';
import { CategoryFilter } from '@/components/events/CategoryFilter';
import { EventCard } from '@/components/events/EventCard';
import { EventCardCompact } from '@/components/events/EventCardCompact';
import { EventCardCompactPlaceholder } from '@/components/events/EventCardCompactPlaceholder';
import { EventSection } from '@/components/events/EventSection';
import { EventEndCard } from '@/components/events/EventEndCard';
import { ProducerCTA } from '@/components/events/ProducerCTA';
import { useEvents } from '@/hooks/useEvents';
import { useHomeEvents } from '@/hooks/useHomeEvents';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);

  const { events, isLoading, error } = useEvents(selectedCategory);
  const { featured, trending, upcoming, recent, all } = useHomeEvents(events);

  // Delay para exibir placeholders por 1 segundo
  const [showPlaceholders, setShowPlaceholders] = useState(true);
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowPlaceholders(false), 100);
      return () => clearTimeout(timer);
    } else {
      setShowPlaceholders(true);
    }
  }, [isLoading]);

  // Scroll para seção de todos os eventos
  const scrollToAllEvents = useCallback(() => {
    const allEventsSection = document.getElementById('all-events');
    if (allEventsSection) {
      allEventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Filter events based on submitted search
  const filteredEvents = submittedSearch
    ? all.filter(
        (event) =>
          event.name.toLowerCase().includes(submittedSearch.toLowerCase()) ||
          event.location.toLowerCase().includes(submittedSearch.toLowerCase()) ||
          event.category.toLowerCase().includes(submittedSearch.toLowerCase())
      )
    : all;

  // Handle search input change (for suggestions)
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handle search submit (Enter or button click)
  const handleSearchSubmit = useCallback((query: string) => {
    setSubmittedSearch(query);
    setIsSearchMode(true);
    setSearchQuery(query);
  }, []);

  // Handle back to home
  const handleBackToHome = useCallback(() => {
    setSearchQuery('');
    setSubmittedSearch('');
    setIsSearchMode(false);
  }, []);

  return (
    <Layout 
      searchQuery={searchQuery} 
      onSearchChange={handleSearchChange}
      onSearchSubmit={handleSearchSubmit}
    >
      {/* Search Results Mode */}
      {isSearchMode ? (
        <>
          {/* Results Header */}
          <section className="container pt-4 sm:pt-6 pb-4 sm:pb-6">
            <div className="flex flex-col gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToHome}
                className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para início
              </Button>
              
              <div>
                <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                  Resultados para: <span className="text-primary">"{submittedSearch}"</span>
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
                </p>
              </div>
            </div>
          </section>

          {/* Filtered Events Grid */}
          <section className="container">
            {error && (
              <div className="text-center py-8 text-destructive text-sm">
                Não foi possível carregar os eventos. Verifique se a API está rodando.
              </div>
            )}
            {isLoading ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {filteredEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-base sm:text-lg mb-2">
                  Nenhum evento encontrado para "{submittedSearch}"
                </p>
                <p className="text-muted-foreground/70 text-sm mb-4">
                  Tente buscar por outro termo ou explore nossos eventos
                </p>
                <Button onClick={handleBackToHome} variant="outline">
                  Ver todos os eventos
                </Button>
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          {/* Hero Carousel (Featured) */}
          <section className="container pt-4 sm:pt-6 pb-4 sm:pb-6">
            {isLoading ? (
              <Skeleton className="w-full aspect-[2/1] rounded-2xl" />
            ) : featured.length > 0 ? (
              <FeaturedCarousel events={featured} />
            ) : null}
          </section>

          {/* 🔥 Eventos em Alta */}
          <EventSection
            title="Eventos em Alta"
            subtitle="Os mais procurados agora"
            icon={<Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />}
            horizontal
            infinite
            endCard={<EventEndCard onViewAll={scrollToAllEvents} />}
            className="mb-6 sm:mb-8"
          >
            {showPlaceholders || isLoading || trending.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <EventCardCompactPlaceholder key={i} />
                ))
              : trending.map((event) => (
                  <EventCardCompact key={event.id} event={event} />
                ))}
          </EventSection>

          {/* 📅 Próximos Eventos */}
          <EventSection
            title="Próximos Eventos"
            subtitle="Acontecendo em breve"
            icon={<CalendarClock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
            horizontal
            infinite
            endCard={<EventEndCard onViewAll={scrollToAllEvents} />}
            className="mb-6 sm:mb-8"
          >
            {showPlaceholders || isLoading || upcoming.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <EventCardCompactPlaceholder key={i} />
                ))
              : upcoming.map((event) => (
                  <EventCardCompact key={event.id} event={event} />
                ))}
          </EventSection>

          {/* ✨ Acabaram de Chegar */}
          <EventSection
            title="Acabaram de Chegar"
            subtitle="Novos eventos para você explorar"
            icon={<Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />}
            horizontal
            infinite
            endCard={<EventEndCard onViewAll={scrollToAllEvents} />}
            className="mb-6 sm:mb-8"
          >
            {showPlaceholders || isLoading || recent.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <EventCardCompactPlaceholder key={i} />
                ))
              : recent.map((event) => (
                  <EventCardCompact key={event.id} event={event} showNew />
                ))}
          </EventSection>

          {/* 📣 CTA Produtores */}
          <ProducerCTA />

          {/* 🎯 Descubra Eventos (com filtro de categoria) */}
          <section id="all-events" className="container mb-6 sm:mb-8 scroll-mt-20">
            <div className="flex flex-col gap-4 mb-5 sm:mb-6">
              <div>
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">
                  Descubra Eventos
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Encontre experiências incríveis
                </p>
              </div>
              <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
            </div>
          </section>

          <section className="container pb-4">
            {error && (
              <div className="text-center py-8 text-destructive text-sm">
                Não foi possível carregar os eventos. Verifique se a API está rodando.
              </div>
            )}
            {isLoading ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
                ))}
              </div>
            ) : all.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {all.map((event, index) => (
                  <div
                    key={event.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <p className="text-muted-foreground text-base sm:text-lg">
                  Nenhum evento encontrado.
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </Layout>
  );
};

export default Index;
