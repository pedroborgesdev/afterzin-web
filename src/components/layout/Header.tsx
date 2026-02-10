import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Ticket, User, Menu, X, LogOut, Home, Backpack, Megaphone, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import { SearchSuggestions } from '@/components/search/SearchSuggestions';
import { Event } from '@/types/events';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
}

export function Header({ searchQuery = '', onSearchChange, onSearchSubmit }: HeaderProps = {}) {
  const { user, isAuthenticated, logout, tickets } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const { suggestions, isLoading } = useSearchSuggestions(inputValue);

  // Sync inputValue with searchQuery prop
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideDesktop = searchContainerRef.current && !searchContainerRef.current.contains(target);
      const isOutsideMobile = mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(target);
      
      if (isOutsideDesktop && isOutsideMobile) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onSearchChange?.(value);
    setShowSuggestions(true);
  };

  const handleSearchSubmit = () => {
    if (inputValue.trim()) {
      setShowSuggestions(false);
      onSearchSubmit?.(inputValue.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (event: Event) => {
    setShowSuggestions(false);
    setInputValue('');
    onSearchChange?.('');
  };

  const handleInputFocus = () => {
    if (inputValue.length >= 2) {
      setShowSuggestions(true);
    }
    // Close mobile menu when focusing on search and focus the sticky input
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      // Focus the sticky input after menu closes
      setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 10);
    }
  };

  const isActive = (path: string) => location.pathname === path;
  const isProducerArea = location.pathname.startsWith('/produtor');
  const showSearch = location.pathname === '/';

  return (
    <>
    <header className="sticky top-0 z-50 bg-primary">
      <div className="container flex h-14 md:h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group shrink-0">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-shadow duration-200">
            <img
              src="/logo.svg"
              alt="Afterzin Logo"
              className="w-9 h-9 md:w-9 md:h-9 object-contain brightness-0 invert"
              draggable="false"
            />
          </div>
          <span className="font-display text-lg md:text-xl font-bold text-white hidden xs:block">
            fterzin
          </span>
        </Link>

        {/* Desktop Search */}
        {showSearch && onSearchChange && (
          <div ref={searchContainerRef} className="hidden md:flex relative w-64 lg:w-80 mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" />
            <Input
              type="text"
              placeholder="Buscar eventos..."
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              className="pl-10 pr-10 bg-white h-9 border-white/20 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {inputValue && (
              <button
                onClick={handleSearchSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-primary/10 transition-colors"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4 text-primary" />
              </button>
            )}
            <SearchSuggestions
              suggestions={suggestions}
              isLoading={isLoading}
              isVisible={showSuggestions}
              onSelect={handleSuggestionSelect}
              onClose={() => setShowSuggestions(false)}
              searchQuery={inputValue}
            />
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link 
            to="/" 
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive('/') 
                ? "bg-white/20 text-white" 
                : "text-white/80 hover:text-white hover:bg-white/10"
            )}
          >
            Eventos
          </Link>
          {isAuthenticated && (
            <Link 
              to="/mochila" 
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                isActive('/mochila') 
                  ? "bg-white/20 text-white" 
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              <Backpack className="w-4 h-4" />
              Mochila
              {tickets.length > 0 && (
                <span className="bg-white text-primary text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center font-semibold">
                  {tickets.length}
                </span>
              )}
            </Link>
          )}
          {isAuthenticated && (
            <Link
              to="/produtor"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                isProducerArea
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              <Megaphone className="w-4 h-4" />
              Produtor
            </Link>
          )}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-1 pr-2 md:pr-3 hover:bg-white/10 transition-colors focus-ring text-white">
                  <Avatar className="h-8 w-8 border-2 border-white/30">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-white/20 text-white text-sm font-medium">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2.5">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/perfil')} className="py-2.5">
                  <User className="w-4 h-4 mr-2" />
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/mochila')} className="py-2.5">
                  <Backpack className="w-4 h-4 mr-2" />
                  Meus Ingressos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/produtor')} className="py-2.5">
                  <Megaphone className="w-4 h-4 mr-2" />
                  Área do Produtor
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="py-2.5 text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/auth')}
                className="hidden sm:inline-flex text-white hover:bg-white/10 hover:text-white"
              >
                Entrar
              </Button>
              <Button 
                size="sm" 
                onClick={() => navigate('/auth?mode=register')}
                className="bg-white text-primary hover:bg-white/90"
              >
                Criar Conta
              </Button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2.5 hover:bg-white/10 rounded-lg transition-colors min-h-touch min-w-touch flex items-center justify-center text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-14 border-t border-border/50 bg-background shadow-lg z-50">
          <nav className="container py-3 flex flex-col gap-1">
            <Link 
              to="/" 
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors font-medium min-h-touch",
                isActive('/') ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              Eventos
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/mochila" 
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors font-medium min-h-touch",
                    isActive('/mochila') ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Backpack className="w-5 h-5" />
                  Mochila de Tickets
                  {tickets.length > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full ml-auto">
                      {tickets.length}
                    </span>
                  )}
                </Link>
                <Link 
                  to="/perfil" 
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors font-medium min-h-touch",
                    isActive('/perfil') ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  Meu Perfil
                </Link>
                <Link 
                  to="/produtor" 
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors font-medium min-h-touch",
                    isProducerArea ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Megaphone className="w-5 h-5" />
                  Área do Produtor
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors font-medium min-h-touch text-destructive hover:bg-destructive/10 w-full text-left mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  Sair da conta
                </button>
              </>
            )}
            {!isAuthenticated && (
              <div className="flex gap-2 px-4 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                >
                  Entrar
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => { navigate('/auth?mode=register'); setMobileMenuOpen(false); }}
                >
                  Criar Conta
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Search inside menu overlay */}
          {showSearch && onSearchChange && (
            <div className="bg-primary border-b border-white/10 rounded-b-2xl">
              <div className="container py-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" />
                  <Input
                    type="text"
                    placeholder="Buscar eventos..."
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                    className="pl-10 pr-10 bg-white h-10 border-white/20 placeholder:text-muted-foreground rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {inputValue && (
                    <button
                      onClick={handleSearchSubmit}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-primary/10 transition-colors"
                      aria-label="Buscar"
                    >
                      <Search className="w-4 h-4 text-primary" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </header>

    {/* Mobile Search - Fixed below header (always mounted to prevent layout reflow) */}
    {showSearch && onSearchChange && (
      <div ref={mobileSearchContainerRef} className={cn(
        "md:hidden sticky top-14 z-40 bg-primary border-b border-white/10 rounded-b-2xl",
        mobileMenuOpen && "invisible"
      )}>
        <div className="container py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" />
            <Input
              ref={mobileSearchInputRef}
              type="text"
              placeholder="Buscar eventos..."
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              className="pl-10 pr-10 bg-white h-10 border-white/20 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {inputValue && (
              <button
                onClick={handleSearchSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-primary/10 transition-colors"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4 text-primary" />
              </button>
            )}
            <SearchSuggestions
              suggestions={suggestions}
              isLoading={isLoading}
              isVisible={showSuggestions}
              onSelect={handleSuggestionSelect}
              onClose={() => setShowSuggestions(false)}
              searchQuery={inputValue}
              className="left-0 right-0 mx-0"
            />
          </div>
        </div>
      </div>
    )}
    </>
  );
}
