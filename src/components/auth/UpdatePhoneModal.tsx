import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { sanitizePhone, formatPhoneNumber } from '@/lib/phone-utils';

interface UpdatePhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpdatePhoneModal({ isOpen, onClose, onSuccess }: UpdatePhoneModalProps) {
  const [phoneCountryCode, setPhoneCountryCode] = useState('55');
  const [phoneAreaCode, setPhoneAreaCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updatePhone } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updatePhone(phoneCountryCode, phoneAreaCode, phoneNumber);

      if (result.success) {
        toast({
          title: 'Telefone atualizado',
          description: 'Seu telefone foi cadastrado com sucesso.',
        });
        onSuccess();
      } else {
        toast({
          title: 'Erro ao atualizar telefone',
          description: result.error || 'Tente novamente.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Erro ao atualizar telefone',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete seu cadastro</DialogTitle>
          <DialogDescription>
            Para continuar com sua compra, precisamos do seu número de telefone.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Telefone
            </Label>
            <div className="flex gap-2">
              <div className="relative w-20">
                <Input
                  id="phoneCountryCode"
                  type="text"
                  placeholder="+55"
                  className="h-11 rounded-xl border-input hover:border-primary focus:border-primary ring-0 ring-primary/20 focus:ring-2 transition-[box-shadow,border-color] duration-300 text-center text-sm placeholder:text-muted-foreground/40"
                  value={`+${phoneCountryCode}`}
                  onChange={(e) => setPhoneCountryCode(sanitizePhone(e.target.value))}
                  maxLength={4}
                />
              </div>

              <div className="relative w-20">
                <Input
                  id="phoneAreaCode"
                  type="text"
                  placeholder="11"
                  className="h-11 rounded-xl border-input hover:border-primary focus:border-primary ring-0 ring-primary/20 focus:ring-2 transition-[box-shadow,border-color] duration-300 text-center font-mono text-sm placeholder:text-muted-foreground/40"
                  value={phoneAreaCode}
                  onChange={(e) => setPhoneAreaCode(sanitizePhone(e.target.value))}
                  maxLength={2}
                  required
                />
              </div>

              <div className="relative flex-1">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <Input
                  id="phoneNumber"
                  type="text"
                  placeholder="99999-9999"
                  className="pl-11 h-11 rounded-xl border-input hover:border-primary focus:border-primary ring-0 ring-primary/20 focus:ring-2 transition-[box-shadow,border-color] duration-300 font-mono text-sm placeholder:text-muted-foreground/40"
                  value={formatPhoneNumber(phoneNumber)}
                  onChange={(e) => setPhoneNumber(sanitizePhone(e.target.value))}
                  maxLength={10}
                  required
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Exemplo: +55 11 99999-9999
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </span>
            ) : (
              'Salvar e Continuar'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
