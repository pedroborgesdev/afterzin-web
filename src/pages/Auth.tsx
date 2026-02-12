import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Calendar, CreditCard, ArrowLeft, Eye, EyeOff, Ticket, Sparkles, Shield, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { sanitizePhone, formatPhoneNumber } from '@/lib/phone-utils';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('55');
  const [phoneAreaCode, setPhoneAreaCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const redirectUrl = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl);
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const formatBirthDateForBackend = (date: string) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (success) {
          toast({
            title: "Bem-vindo de volta! 👋",
            description: "Login realizado com sucesso.",
          });
          navigate(redirectUrl);
        } else {
          toast({
            title: "Erro no login",
            description: "E-mail ou senha incorretos. Tente novamente.",
            variant: "destructive",
          });
        }
      } else {
        const result = await register({
          name,
          email,
          cpf,
          birthDate: formatBirthDateForBackend(birthDate),
          password,
          phoneCountryCode,
          phoneAreaCode,
          phoneNumber,
        });
        if (result.success) {
          toast({
            title: "Conta criada! 🎉",
            description: "Bem-vindo ao Afterzin.",
          });
          navigate(redirectUrl);
        } else {
          toast({
            title: "Erro no cadastro",
            description: result.error || "E-mail já cadastrado ou dados inválidos. Tente novamente.",
            variant: "destructive",
          });
        }
      }
    } catch {
      toast({
        title: "Erro",
        description: "Algo deu errado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col-reverse lg:flex-row overflow-hidden bg-background">
      {/* Left Panel - Form Area */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="flex items-center justify-center min-h-full px-6 py-8 sm:px-8 lg:px-10 xl:px-14">
          <div className="w-full max-w-[420px]">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between mb-10">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo.svg"
                  alt="Afterzin Logo"
                  className="w-9 h-9 object-contain"
                  draggable="false"
                />
              </div>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                Voltar
              </button>
            </div>

            {/* Desktop voltar */}
            <button
              onClick={() => navigate('/')}
              className="hidden lg:flex items-center gap-2 text-muted-foreground hover:text-foreground mb-10 transition-colors py-1 -ml-1 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Voltar para o início</span>
            </button>

            {/* Header do formulário */}
            <div className="mb-7">
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold mb-4">
                {mode === 'login' ? '👋 Que bom te ver de novo' : '✨ Crie sua conta grátis'}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1.5">
                {mode === 'login' ? 'Entrar na sua conta' : 'Criar sua conta'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {mode === 'login'
                  ? 'Acesse seus ingressos e acompanhe seus eventos'
                  : 'Comece a descobrir os melhores eventos agora'}
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Nome Completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        className="pl-11 h-11 rounded-xl border-input hover:border-primary focus:border-primary ring-0 ring-primary/20 focus:ring-2 transition-[box-shadow,border-color] duration-300 placeholder:text-muted-foreground/40"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="cpf" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        CPF
                      </Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                        <Input
                          id="cpf"
                          type="text"
                          placeholder="000.000.000-00"
                          className="pl-11 h-11 rounded-xl border-input hover:border-primary focus:border-primary ring-0 ring-primary/20 focus:ring-2 transition-[box-shadow,border-color] duration-300 font-mono text-sm placeholder:text-muted-foreground/40"
                          value={cpf}
                          onChange={(e) => setCpf(formatCpf(e.target.value))}
                          maxLength={14}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="birthDate" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Nascimento
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                        <Input
                          id="birthDate"
                          type="text"
                          className="pl-11 h-11 rounded-xl border-input hover:border-primary focus:border-primary ring-0 ring-primary/20 focus:ring-2 transition-[box-shadow,border-color] duration-300 text-sm placeholder:text-muted-foreground/40"
                          value={birthDate}
                          onChange={(e) => setBirthDate(formatDate(e.target.value))}
                          placeholder="DD/MM/AAAA"
                          maxLength={10}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
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
                </>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-11 h-11 rounded-xl border-input hover:border-primary focus:border-primary ring-0 ring-primary/20 focus:ring-2 transition-[box-shadow,border-color] duration-300 placeholder:text-muted-foreground/40"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Senha
                  </Label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      className="text-xs text-primary font-medium hover:text-primary/80 transition-colors"
                    >
                      Esqueceu?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-11 pr-11 h-11 rounded-xl border-input hover:border-primary focus:border-primary ring-0 ring-primary/20 focus:ring-2 transition-[box-shadow,border-color] duration-300 placeholder:text-muted-foreground/40"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-all"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-sm font-bold rounded-xl mt-2"
                size="lg"
                disabled={isLoading}
              >
                {isLoading
                  ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Aguarde...
                    </span>
                  )
                  : mode === 'login'
                    ? 'Entrar'
                    : 'Criar minha conta'}
              </Button>
            </form>

            {/* Alternar modo */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground text-sm">
                {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
                {' '}
                <button
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-primary font-semibold hover:text-primary/80 transition-colors"
                >
                  {mode === 'login' ? 'Cadastre-se' : 'Entrar'}
                </button>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 bg-white rounded-xl px-4 py-3">
              <p className="text-center text-[11px] text-muted-foreground/60 leading-relaxed">
                Ao continuar, você concorda com nossos{' '}
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors underline underline-offset-2">Termos de Uso</a>
                {' '}e{' '}
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors underline underline-offset-2">Política de Privacidade</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Branding Area */}
      <div className="relative hidden lg:flex lg:shrink-0 items-center justify-center p-4">
        <div className="relative h-full w-full max-w-[50vw] xl:max-w-[50vw] overflow-hidden rounded-3xl">
          <img
            src="/cta.png"
            alt="Pessoas se divertindo em um show"
            className="h-full w-full object-cover blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/55 to-primary/75" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-12">
            <img
              src="/logo.svg"
              alt="Afterzin Logo"
              className="w-36 h-36 xl:w-48 xl:h-48 object-contain brightness-0 invert drop-shadow-2xl"
              draggable="false"
            />
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              {[
                { icon: Ticket, text: 'Ingressos verificados' },
                { icon: Sparkles, text: 'Experiências únicas' },
                { icon: Shield, text: 'Compra segura' },
              ].map(({ icon: Icon, text }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2"
                >
                  <Icon className="w-3.5 h-3.5 text-white" />
                  <span className="text-white text-xs font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
