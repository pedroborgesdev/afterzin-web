import { Link } from 'react-router-dom';
import { Megaphone, Ticket, QrCode, BarChart3, Layers, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  { icon: Ticket, label: 'Gestão completa de ingressos' },
  { icon: Layers, label: 'Controle de lotes e vendas' },
  { icon: QrCode, label: 'QR Code por ingresso' },
  { icon: BarChart3, label: 'Painel exclusivo do produtor' },
];

/**
 * CTA de conversão para produtores de eventos.
 * Posicionada no meio da Home para captar organizadores.
 * Comunica taxas, benefícios e direciona à ação.
 */
export function ProducerCTA() {
  return (
    <section className="my-8 sm:my-12">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/85">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative px-5 py-8 sm:px-10 sm:py-12 md:px-14 md:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4 sm:mb-5">
                  <Megaphone className="w-4 h-4 text-white" />
                  <span className="text-white/90 text-xs sm:text-sm font-medium">Para produtores de eventos</span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-3 sm:mb-4">
                  Anuncie seu evento e<br className="hidden sm:block" /> venda ingressos online
                </h2>

                <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-lg">
                  Publique gratuitamente e pague apenas quando vender.
                  Sem mensalidade, sem custos ocultos.
                </p>

                {/* Pricing highlight */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-5 mb-6 sm:mb-8 max-w-sm">
                  <p className="text-white/70 text-xs sm:text-sm mb-1">Taxa por venda</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-2xl sm:text-3xl font-bold text-white">R$ 5,00</span>
                    <span className="text-white/70 text-sm sm:text-base">+ 1,19%</span>
                  </div>
                  <p className="text-white/60 text-xs mt-1.5">Cobrado apenas quando houver venda</p>
                </div>

                <Link to="/produtor">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-semibold text-sm sm:text-base px-6 sm:px-8 h-11 sm:h-12 rounded-xl shadow-lg shadow-black/10 w-full sm:w-auto"
                  >
                    Seja um produtor
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Benefits grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {benefits.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 sm:p-5 flex flex-col items-start gap-2.5 sm:gap-3 hover:bg-white/15 transition-colors"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/15 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-white text-xs sm:text-sm font-medium leading-snug">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
