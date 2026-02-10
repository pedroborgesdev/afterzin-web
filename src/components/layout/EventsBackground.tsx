import { memo } from 'react';
import {
  Ticket,
  Music,
  Guitar,
  Mic,
  Mic2,
  Calendar,
  CalendarDays,
  Wine,
  GlassWater,
  Lightbulb,
  Star,
  PartyPopper,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Configuração dos ícones decorativos.
 * Cada entrada define: componente, posição (%), tamanho, rotação e opacidade.
 * Distribuídos organicamente — sem grid, sem padrão previsível.
 */
const decorativeIcons = [
  // Top area - Layer 1
  { Icon: Ticket, top: '1%', left: '3%', size: 48, rotate: -15, opacity: 0.07 },
  { Icon: Music, top: '2%', left: '12%', size: 52, rotate: 20, opacity: 0.07 },
  { Icon: Star, top: '1%', left: '22%', size: 42, rotate: 10, opacity: 0.07 },
  { Icon: Mic, top: '3%', left: '32%', size: 46, rotate: -25, opacity: 0.07 },
  { Icon: Guitar, top: '2%', left: '41%', size: 58, rotate: 30, opacity: 0.07 },
  { Icon: CalendarDays, top: '1%', left: '51%', size: 44, rotate: -10, opacity: 0.07 },
  { Icon: Wine, top: '3%', left: '60%', size: 50, rotate: 15, opacity: 0.07 },
  { Icon: PartyPopper, top: '2%', left: '69%', size: 54, rotate: -20, opacity: 0.07 },
  { Icon: Lightbulb, top: '1%', left: '78%', size: 46, rotate: 12, opacity: 0.07 },
  { Icon: Mic2, top: '3%', left: '87%', size: 52, rotate: -18, opacity: 0.07 },
  { Icon: Ticket, top: '2%', left: '95%', size: 48, rotate: 25, opacity: 0.07 },

  // Top area - Layer 2
  { Icon: Calendar, top: '6%', left: '5%', size: 44, rotate: -8, opacity: 0.07 },
  { Icon: Music, top: '7%', left: '16%', size: 50, rotate: -22, opacity: 0.07 },
  { Icon: Star, top: '6%', left: '27%', size: 46, rotate: 35, opacity: 0.07 },
  { Icon: GlassWater, top: '8%', left: '37%', size: 52, rotate: -12, opacity: 0.07 },
  { Icon: Guitar, top: '7%', left: '48%', size: 56, rotate: 18, opacity: 0.07 },
  { Icon: Wine, top: '6%', left: '58%', size: 44, rotate: -30, opacity: 0.07 },
  { Icon: PartyPopper, top: '8%', left: '68%', size: 54, rotate: 22, opacity: 0.07 },
  { Icon: Mic, top: '7%', left: '79%', size: 48, rotate: -15, opacity: 0.07 },
  { Icon: Ticket, top: '6%', left: '89%', size: 42, rotate: 8, opacity: 0.07 },

  // Upper area - Layer 3
  { Icon: Lightbulb, top: '11%', left: '2%', size: 50, rotate: 20, opacity: 0.07 },
  { Icon: CalendarDays, top: '12%', left: '13%', size: 46, rotate: -25, opacity: 0.07 },
  { Icon: Music, top: '11%', left: '24%', size: 52, rotate: 15, opacity: 0.07 },
  { Icon: Star, top: '13%', left: '34%', size: 44, rotate: -10, opacity: 0.07 },
  { Icon: Guitar, top: '12%', left: '45%', size: 58, rotate: 28, opacity: 0.07 },
  { Icon: Mic2, top: '11%', left: '56%', size: 42, rotate: -20, opacity: 0.07 },
  { Icon: Ticket, top: '13%', left: '66%', size: 48, rotate: 12, opacity: 0.07 },
  { Icon: Wine, top: '12%', left: '76%', size: 50, rotate: -18, opacity: 0.07 },
  { Icon: Calendar, top: '11%', left: '86%', size: 46, rotate: 25, opacity: 0.07 },
  { Icon: Music, top: '13%', left: '94%', size: 52, rotate: -15, opacity: 0.07 },

  // Upper-middle area - Layer 4
  { Icon: PartyPopper, top: '17%', left: '4%', size: 54, rotate: 30, opacity: 0.07 },
  { Icon: Star, top: '18%', left: '15%', size: 46, rotate: -12, opacity: 0.07 },
  { Icon: Mic, top: '17%', left: '26%', size: 48, rotate: 18, opacity: 0.07 },
  { Icon: GlassWater, top: '19%', left: '36%', size: 52, rotate: -22, opacity: 0.07 },
  { Icon: Guitar, top: '18%', left: '47%', size: 56, rotate: 25, opacity: 0.07 },
  { Icon: Lightbulb, top: '17%', left: '58%', size: 50, rotate: -8, opacity: 0.07 },
  { Icon: CalendarDays, top: '19%', left: '68%', size: 44, rotate: 15, opacity: 0.07 },
  { Icon: Ticket, top: '18%', left: '78%', size: 48, rotate: -28, opacity: 0.07 },
  { Icon: Wine, top: '17%', left: '88%', size: 50, rotate: 20, opacity: 0.07 },

  // Middle area - Layer 5
  { Icon: Music, top: '23%', left: '1%', size: 52, rotate: -15, opacity: 0.07 },
  { Icon: Mic2, top: '24%', left: '11%', size: 46, rotate: 22, opacity: 0.07 },
  { Icon: Calendar, top: '23%', left: '21%', size: 44, rotate: -18, opacity: 0.07 },
  { Icon: Star, top: '25%', left: '31%', size: 48, rotate: 12, opacity: 0.07 },
  { Icon: Guitar, top: '24%', left: '42%', size: 58, rotate: -25, opacity: 0.07 },
  { Icon: PartyPopper, top: '23%', left: '53%', size: 54, rotate: 18, opacity: 0.07 },
  { Icon: Ticket, top: '25%', left: '63%', size: 42, rotate: -10, opacity: 0.07 },
  { Icon: Wine, top: '24%', left: '73%', size: 50, rotate: 28, opacity: 0.07 },
  { Icon: Mic, top: '23%', left: '83%', size: 48, rotate: -20, opacity: 0.07 },
  { Icon: Lightbulb, top: '25%', left: '92%', size: 46, rotate: 15, opacity: 0.07 },

  // Middle area - Layer 6
  { Icon: GlassWater, top: '29%', left: '6%', size: 52, rotate: 25, opacity: 0.07 },
  { Icon: CalendarDays, top: '30%', left: '17%', size: 44, rotate: -12, opacity: 0.07 },
  { Icon: Music, top: '29%', left: '28%', size: 50, rotate: 18, opacity: 0.07 },
  { Icon: Star, top: '31%', left: '38%', size: 46, rotate: -22, opacity: 0.07 },
  { Icon: Guitar, top: '30%', left: '49%', size: 56, rotate: 30, opacity: 0.07 },
  { Icon: Mic2, top: '29%', left: '60%', size: 42, rotate: -15, opacity: 0.07 },
  { Icon: Ticket, top: '31%', left: '70%', size: 48, rotate: 20, opacity: 0.07 },
  { Icon: Wine, top: '30%', left: '80%', size: 50, rotate: -28, opacity: 0.07 },
  { Icon: Calendar, top: '29%', left: '90%', size: 44, rotate: 12, opacity: 0.07 },

  // Center area - Layer 7
  { Icon: PartyPopper, top: '35%', left: '3%', size: 54, rotate: -18, opacity: 0.07 },
  { Icon: Star, top: '36%', left: '14%', size: 46, rotate: 25, opacity: 0.07 },
  { Icon: Mic, top: '35%', left: '25%', size: 48, rotate: -10, opacity: 0.07 },
  { Icon: Lightbulb, top: '37%', left: '35%', size: 50, rotate: 18, opacity: 0.07 },
  { Icon: Guitar, top: '36%', left: '46%', size: 58, rotate: -22, opacity: 0.07 },
  { Icon: Music, top: '35%', left: '57%', size: 52, rotate: 15, opacity: 0.07 },
  { Icon: CalendarDays, top: '37%', left: '67%', size: 44, rotate: -28, opacity: 0.07 },
  { Icon: Ticket, top: '36%', left: '77%', size: 48, rotate: 20, opacity: 0.07 },
  { Icon: Wine, top: '35%', left: '87%', size: 50, rotate: -15, opacity: 0.07 },
  { Icon: GlassWater, top: '37%', left: '96%', size: 52, rotate: 12, opacity: 0.07 },

  // Lower-middle area - Layer 8
  { Icon: Calendar, top: '42%', left: '8%', size: 44, rotate: 22, opacity: 0.07 },
  { Icon: Mic2, top: '43%', left: '19%', size: 46, rotate: -18, opacity: 0.07 },
  { Icon: Star, top: '42%', left: '30%', size: 48, rotate: 25, opacity: 0.07 },
  { Icon: Guitar, top: '44%', left: '40%', size: 56, rotate: -12, opacity: 0.07 },
  { Icon: PartyPopper, top: '43%', left: '51%', size: 54, rotate: 18, opacity: 0.07 },
  { Icon: Ticket, top: '42%', left: '62%', size: 42, rotate: -25, opacity: 0.07 },
  { Icon: Wine, top: '44%', left: '72%', size: 50, rotate: 15, opacity: 0.07 },
  { Icon: Mic, top: '43%', left: '82%', size: 48, rotate: -20, opacity: 0.07 },
  { Icon: Lightbulb, top: '42%', left: '92%', size: 46, rotate: 28, opacity: 0.07 },

  // Lower-middle area - Layer 9
  { Icon: Music, top: '48%', left: '5%', size: 52, rotate: -15, opacity: 0.07 },
  { Icon: CalendarDays, top: '49%', left: '16%', size: 44, rotate: 20, opacity: 0.07 },
  { Icon: Star, top: '48%', left: '27%', size: 46, rotate: -22, opacity: 0.07 },
  { Icon: GlassWater, top: '50%', left: '37%', size: 52, rotate: 18, opacity: 0.07 },
  { Icon: Guitar, top: '49%', left: '48%', size: 58, rotate: -10, opacity: 0.07 },
  { Icon: Ticket, top: '48%', left: '59%', size: 42, rotate: 25, opacity: 0.07 },
  { Icon: Wine, top: '50%', left: '69%', size: 50, rotate: -28, opacity: 0.07 },
  { Icon: PartyPopper, top: '49%', left: '79%', size: 54, rotate: 15, opacity: 0.07 },
  { Icon: Mic, top: '48%', left: '89%', size: 48, rotate: -18, opacity: 0.07 },

  // Lower area - Layer 10
  { Icon: Lightbulb, top: '54%', left: '2%', size: 50, rotate: 12, opacity: 0.07 },
  { Icon: Calendar, top: '55%', left: '13%', size: 44, rotate: -25, opacity: 0.07 },
  { Icon: Mic2, top: '54%', left: '24%', size: 46, rotate: 22, opacity: 0.07 },
  { Icon: Music, top: '56%', left: '34%', size: 52, rotate: -15, opacity: 0.07 },
  { Icon: Star, top: '55%', left: '45%', size: 48, rotate: 18, opacity: 0.07 },
  { Icon: Guitar, top: '54%', left: '56%', size: 56, rotate: -20, opacity: 0.07 },
  { Icon: CalendarDays, top: '56%', left: '66%', size: 44, rotate: 28, opacity: 0.07 },
  { Icon: Ticket, top: '55%', left: '76%', size: 42, rotate: -12, opacity: 0.07 },
  { Icon: Wine, top: '54%', left: '86%', size: 50, rotate: 15, opacity: 0.07 },
  { Icon: GlassWater, top: '56%', left: '95%', size: 52, rotate: -22, opacity: 0.07 },

  // Lower area - Layer 11
  { Icon: PartyPopper, top: '60%', left: '7%', size: 54, rotate: 25, opacity: 0.07 },
  { Icon: Mic, top: '61%', left: '18%', size: 48, rotate: -18, opacity: 0.07 },
  { Icon: Star, top: '60%', left: '29%', size: 46, rotate: 20, opacity: 0.07 },
  { Icon: Lightbulb, top: '62%', left: '39%', size: 50, rotate: -10, opacity: 0.07 },
  { Icon: Guitar, top: '61%', left: '50%', size: 58, rotate: 15, opacity: 0.07 },
  { Icon: Music, top: '60%', left: '61%', size: 52, rotate: -28, opacity: 0.07 },
  { Icon: Calendar, top: '62%', left: '71%', size: 44, rotate: 22, opacity: 0.07 },
  { Icon: Ticket, top: '61%', left: '81%', size: 48, rotate: -15, opacity: 0.07 },
  { Icon: Wine, top: '60%', left: '91%', size: 50, rotate: 18, opacity: 0.07 },

  // Bottom area - Layer 12
  { Icon: Mic2, top: '66%', left: '4%', size: 46, rotate: -20, opacity: 0.07 },
  { Icon: CalendarDays, top: '67%', left: '15%', size: 44, rotate: 25, opacity: 0.07 },
  { Icon: Star, top: '66%', left: '26%', size: 48, rotate: -12, opacity: 0.07 },
  { Icon: GlassWater, top: '68%', left: '36%', size: 52, rotate: 18, opacity: 0.07 },
  { Icon: Guitar, top: '67%', left: '47%', size: 56, rotate: -22, opacity: 0.07 },
  { Icon: PartyPopper, top: '66%', left: '58%', size: 54, rotate: 15, opacity: 0.07 },
  { Icon: Ticket, top: '68%', left: '68%', size: 42, rotate: -28, opacity: 0.07 },
  { Icon: Wine, top: '67%', left: '78%', size: 50, rotate: 20, opacity: 0.07 },
  { Icon: Mic, top: '66%', left: '88%', size: 48, rotate: -15, opacity: 0.07 },

  // Bottom area - Layer 13
  { Icon: Lightbulb, top: '72%', left: '1%', size: 50, rotate: 12, opacity: 0.07 },
  { Icon: Music, top: '73%', left: '12%', size: 52, rotate: -18, opacity: 0.07 },
  { Icon: Calendar, top: '72%', left: '23%', size: 44, rotate: 25, opacity: 0.07 },
  { Icon: Star, top: '74%', left: '33%', size: 46, rotate: -10, opacity: 0.07 },
  { Icon: Guitar, top: '73%', left: '44%', size: 58, rotate: 22, opacity: 0.07 },
  { Icon: Mic2, top: '72%', left: '55%', size: 42, rotate: -15, opacity: 0.07 },
  { Icon: Ticket, top: '74%', left: '65%', size: 48, rotate: 18, opacity: 0.07 },
  { Icon: Wine, top: '73%', left: '75%', size: 50, rotate: -25, opacity: 0.07 },
  { Icon: CalendarDays, top: '72%', left: '85%', size: 44, rotate: 20, opacity: 0.07 },
  { Icon: GlassWater, top: '74%', left: '94%', size: 52, rotate: -12, opacity: 0.07 },

  // Bottom area - Layer 14
  { Icon: PartyPopper, top: '78%', left: '6%', size: 54, rotate: 28, opacity: 0.07 },
  { Icon: Star, top: '79%', left: '17%', size: 46, rotate: -15, opacity: 0.07 },
  { Icon: Mic, top: '78%', left: '28%', size: 48, rotate: 20, opacity: 0.07 },
  { Icon: Lightbulb, top: '80%', left: '38%', size: 50, rotate: -22, opacity: 0.07 },
  { Icon: Guitar, top: '79%', left: '49%', size: 56, rotate: 15, opacity: 0.07 },
  { Icon: Music, top: '78%', left: '60%', size: 52, rotate: -18, opacity: 0.07 },
  { Icon: Calendar, top: '80%', left: '70%', size: 44, rotate: 25, opacity: 0.07 },
  { Icon: Ticket, top: '79%', left: '80%', size: 48, rotate: -10, opacity: 0.07 },
  { Icon: Wine, top: '78%', left: '90%', size: 50, rotate: 18, opacity: 0.07 },

  // Bottom area - Layer 15
  { Icon: Mic2, top: '84%', left: '3%', size: 46, rotate: -20, opacity: 0.07 },
  { Icon: CalendarDays, top: '85%', left: '14%', size: 44, rotate: 22, opacity: 0.07 },
  { Icon: Star, top: '84%', left: '25%', size: 48, rotate: -15, opacity: 0.07 },
  { Icon: GlassWater, top: '86%', left: '35%', size: 52, rotate: 18, opacity: 0.07 },
  { Icon: Guitar, top: '85%', left: '46%', size: 58, rotate: -25, opacity: 0.07 },
  { Icon: PartyPopper, top: '84%', left: '57%', size: 54, rotate: 12, opacity: 0.07 },
  { Icon: Ticket, top: '86%', left: '67%', size: 42, rotate: -28, opacity: 0.07 },
  { Icon: Wine, top: '85%', left: '77%', size: 50, rotate: 20, opacity: 0.07 },
  { Icon: Mic, top: '84%', left: '87%', size: 48, rotate: -15, opacity: 0.07 },
  { Icon: Lightbulb, top: '86%', left: '96%', size: 50, rotate: 25, opacity: 0.07 },

  // Very bottom area - Layer 16
  { Icon: Music, top: '90%', left: '8%', size: 52, rotate: -18, opacity: 0.07 },
  { Icon: Calendar, top: '91%', left: '19%', size: 44, rotate: 22, opacity: 0.07 },
  { Icon: Star, top: '90%', left: '30%', size: 46, rotate: -12, opacity: 0.07 },
  { Icon: Guitar, top: '92%', left: '40%', size: 56, rotate: 15, opacity: 0.07 },
  { Icon: Ticket, top: '91%', left: '51%', size: 48, rotate: -25, opacity: 0.07 },
  { Icon: Wine, top: '90%', left: '62%', size: 50, rotate: 20, opacity: 0.07 },
  { Icon: Mic2, top: '92%', left: '72%', size: 42, rotate: -10, opacity: 0.07 },
  { Icon: CalendarDays, top: '91%', left: '82%', size: 44, rotate: 18, opacity: 0.07 },
  { Icon: PartyPopper, top: '90%', left: '92%', size: 54, rotate: -22, opacity: 0.07 },

  // Final bottom - Layer 17
  { Icon: Lightbulb, top: '95%', left: '5%', size: 50, rotate: 15, opacity: 0.07 },
  { Icon: Star, top: '96%', left: '16%', size: 46, rotate: -20, opacity: 0.07 },
  { Icon: Mic, top: '95%', left: '27%', size: 48, rotate: 25, opacity: 0.07 },
  { Icon: GlassWater, top: '97%', left: '37%', size: 52, rotate: -12, opacity: 0.07 },
  { Icon: Guitar, top: '96%', left: '48%', size: 58, rotate: 18, opacity: 0.07 },
  { Icon: Music, top: '95%', left: '59%', size: 52, rotate: -28, opacity: 0.07 },
  { Icon: Ticket, top: '97%', left: '69%', size: 42, rotate: 22, opacity: 0.07 },
  { Icon: Wine, top: '96%', left: '79%', size: 50, rotate: -15, opacity: 0.07 },
  { Icon: Calendar, top: '95%', left: '89%', size: 44, rotate: 20, opacity: 0.07 },
];

interface EventsBackgroundProps {
  className?: string;
}

/**
 * Background decorativo com ícones de eventos.
 * - Ícones grandes, cinza, ~5-8% opacidade
 * - Distribuição orgânica (não-grid)
 * - pointer-events: none (não interfere com cliques)
 * - Responsivo: esconde metade dos ícones em mobile
 */
export const EventsBackground = memo(function EventsBackground({ className }: EventsBackgroundProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 overflow-hidden pointer-events-none select-none z-0',
        'will-change-transform backface-hidden [transform:translateZ(0)]',
        className
      )}
      aria-hidden="true"
    >
      {decorativeIcons.map(({ Icon, top, left, size, rotate, opacity }, index) => (
        <div
          key={index}
          className={cn(
            'absolute text-muted-foreground/50',
            // Em mobile, esconde metade dos ícones (os pares) para reduzir densidade
            index % 2 === 0 ? '' : 'hidden sm:block'
          )}
          style={{
            top,
            left,
            opacity,
            transform: `rotate(${rotate}deg)`,
          }}
        >
          <Icon
            className="stroke-[1.2]"
            style={{ width: size, height: size }}
          />
        </div>
      ))}
    </div>
  );
});
