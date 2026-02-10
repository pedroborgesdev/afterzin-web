import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Backpack, ArrowLeft, Search, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { TicketCard } from '@/components/tickets/TicketCard';
import { TicketModal } from '@/components/tickets/TicketModal';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTicketSearch } from '@/hooks/useTicketSearch';

export default function TicketBag() {
  const navigate = useNavigate();
  const { tickets, isAuthenticated } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<typeof tickets[0] | null>(null);
  const { searchQuery, setSearchQuery, filteredTickets, clearSearch, isFiltering, hasResults } = useTicketSearch(tickets);
  const searchInputRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-16 sm:py-20 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
              <Backpack className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold mb-3">Faça login para ver seus ingressos</h1>
            <p className="text-muted-foreground text-sm sm:text-base mb-6">
              Você precisa estar logado para acessar sua Mochila de Tickets.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Fazer Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-5 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors py-1 -ml-1 min-h-touch"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar</span>
          </button>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-primary flex items-center justify-center shrink-0">
              <Backpack className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">Mochila de Tickets</h1>
              <p className="text-muted-foreground text-sm">
                {tickets.length === 0 
                  ? 'Nenhum ingresso' 
                  : `${tickets.length} ingresso${tickets.length > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        {tickets.length > 0 && (
          <div className="mb-5 sm:mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar por evento, local, data, tipo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-10 bg-card border-border/60 placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => { clearSearch(); searchInputRef.current?.focus(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-muted transition-colors"
                  aria-label="Limpar pesquisa"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            {isFiltering && (
              <p className="text-xs text-muted-foreground mt-2 ml-1">
                {hasResults
                  ? `${filteredTickets.length} ticket${filteredTickets.length > 1 ? 's' : ''} encontrado${filteredTickets.length > 1 ? 's' : ''}`
                  : 'Nenhum ticket encontrado'}
              </p>
            )}
          </div>
        )}

        {/* Tickets Grid */}
        {tickets.length > 0 ? (
          filteredTickets.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {filteredTickets.map((ticket, index) => (
                <div 
                  key={ticket.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <TicketCard
                    ticket={ticket}
                    onOpen={() => setSelectedTicket(ticket)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 bg-card rounded-2xl">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground" />
              </div>
              <h2 className="font-display text-lg sm:text-xl font-bold mb-2">Nenhum ticket encontrado</h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-5 max-w-xs mx-auto">
                Nenhum ticket corresponde a "<span className="font-medium text-foreground">{searchQuery}</span>"
              </p>
              <Button variant="outline" onClick={() => { clearSearch(); searchInputRef.current?.focus(); }}>
                Limpar pesquisa
              </Button>
            </div>
          )
        ) : (
          <div className="text-center py-12 sm:py-16 bg-card rounded-2xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
              <Backpack className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold mb-2">Sua mochila está vazia</h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-xs mx-auto">
              Compre seu primeiro ingresso e ele aparecerá aqui!
            </p>
            <Button onClick={() => navigate('/')}>
              Explorar Eventos
            </Button>
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </Layout>
  );
}
