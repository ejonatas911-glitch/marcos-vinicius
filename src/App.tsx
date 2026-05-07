/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Instagram, 
  MessageCircle, 
  Dumbbell, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight,
  Flame,
  Zap,
  Activity,
  User,
  HeartPulse,
  Monitor,
  CheckCircle2,
  Lock,
  ArrowRight,
  LogOut,
  ExternalLink,
  ClipboardList,
  Mail,
  ChevronLeft,
  MapPin
} from 'lucide-react';
import { cn } from './lib/utils';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import StudentArea from './components/StudentArea';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './lib/firebase';

const LINKS = [
  {
    title: 'Consultoria Online 1-on-1',
    description: 'Treino e dieta personalizados para seu objetivo.',
    icon: <Target className="w-5 h-5" />,
    url: 'https://wa.me/5598970031298?text=Ol%C3%A1%20Marcos%21%20Quero%20transformar%20meu%20f%C3%ADsico%20e%20gostaria%20de%20saber%20mais%20sobre%20a%20sua%20consultoria%20online.',
    highlight: true,
  },
  {
    title: 'Me chama no WhatsApp',
    description: 'Tire suas dúvidas agora mesmo.',
    icon: <MessageCircle className="w-5 h-5" />,
    url: 'https://wa.me/5598970031298?text=Ol%C3%A1%20Marcos%21%20Vi%20seu%20perfil%20e%20decidi%20mudar%20meu%20estilo%20de%20vida.%20Desejo%20o%20seu%20acompanhamento%21',
    highlight: false,
  },
  {
    title: 'Acompanhe no Instagram',
    description: 'Dicas diárias e resultados de alunos.',
    icon: <Instagram className="w-5 h-5" />,
    url: 'https://www.instagram.com/viniciusmarcos95647?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    highlight: false,
  },
];

const SERVICES = [
  {
    title: 'Emagrecimento e queima de gordura',
    icon: <Flame className="w-4 h-4 text-brand-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />,
    description: 'Protocolos focados no déficit calórico estratégico e exercícios de alta intensidade (HIIT) para maximizar a oxidação de gordura e acelerar o metabolismo.',
    message: 'Olá Marcos! Gostaria de saber mais sobre seu programa de emagrecimento e queima de gordura.',
  },
  {
    title: 'Hipertrofia (massa muscular)',
    icon: <Dumbbell className="w-4 h-4 text-brand-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />,
    description: 'Planejamento de treino baseado em volume, intensidade e progressão de carga para estimular o máximo crescimento muscular de forma sólida.',
    message: 'Olá Marcos! Gostaria de saber mais sobre o treinamento focado em hipertrofia e ganho de massa.',
  },
  {
    title: 'Definição corporal',
    icon: <CheckCircle2 className="w-4 h-4 text-brand-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />,
    description: 'O equilíbrio perfeito entre manutenção de massa magra e redução de percentual de gordura para destacar a musculatura.',
    message: 'Olá Marcos! Tenho interesse no seu protocolo de definição corporal.',
  },
  {
    title: 'Treinamento para iniciantes',
    icon: <Activity className="w-4 h-4 text-brand-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />,
    description: 'Adaptação muscular e aprendizado técnico dos movimentos. Ideal para quem está começando e quer evitar lesões e desistências.',
    message: 'Olá Marcos! Estou começando agora e gostaria de saber como funciona o seu acompanhamento para iniciantes.',
  },
  {
    title: 'Condicionamento físico geral',
    icon: <HeartPulse className="w-4 h-4 text-brand-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />,
    description: 'Melhoria da capacidade cardiorrespiratória, resistência e disposição para as atividades do dia a dia.',
    message: 'Olá Marcos! Quero melhorar meu condicionamento físico, como podemos começar?',
  },
  {
    title: 'Treino personalizado individual',
    icon: <User className="w-4 h-4 text-brand-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />,
    description: 'Atenção total aos seus limites e objetivos. Um treino montado exclusivamente para a sua individualidade biológica.',
    message: 'Olá Marcos! Gostaria de informações sobre o treino personalizado individual.',
  },
  {
    title: 'Treino para ganho de força',
    icon: <Zap className="w-4 h-4 text-brand-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />,
    description: 'Foco em exercícios multiarticulares e powerlifting para aumentar sua força absoluta e potência neuromuscular.',
    message: 'Olá Marcos! Meu foco é ganho de força, gostaria de conhecer seu método.',
  },
  {
    title: 'Treinamento funcional',
    icon: <TrendingUp className="w-4 h-4 text-brand-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />,
    description: 'Treinos dinâmicos que utilizam o peso do corpo e acessórios para melhorar força, equilíbrio, flexibilidade e agilidade.',
    message: 'Olá Marcos! Gostaria de saber mais sobre suas aulas de treinamento funcional.',
  },
  {
    title: 'Reeducação física',
    icon: <ShieldCheck className="w-4 h-4 text-brand-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />,
    description: 'Correção de padrões de movimento, alívio de dores articulares e melhoria da postura através do exercício inteligente.',
    message: 'Olá Marcos! Busco reeducação física e melhoria na postura. Pode me ajudar?',
  },
  {
    title: 'Acompanhamento online',
    icon: <Monitor className="w-4 h-4 text-brand-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />,
    description: 'Consultoria completa via app com vídeos, planilhas e suporte via WhatsApp para você treinar onde e quando quiser.',
    message: 'Olá Marcos! Gostaria de entender como funciona sua consultoria online.',
  },
];

const RESULTS = [
  {
    name: 'Carlos S.',
    result: '-12kg em 3 meses',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400',
    type: 'Emagrecimento'
  },
  {
    name: 'Ana Paula',
    result: 'Definição Abdominal',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400',
    type: 'Definição'
  },
  {
    name: 'Ricardo M.',
    result: '+8kg Massa Magra',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?auto=format&fit=crop&q=80&w=400',
    type: 'Hipertrofia'
  }
];

const WHATSAPP_BASE_URL = "https://wa.me/5598970031298";
const DEFAULT_WHATSAPP_MESSAGE = "Olá Marcos! Gostaria de transformar meu físico e começar meu treinamento agora mesmo.";

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { loading, user } = useAuth();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'links' | 'results' | 'about'>('links');
  const [isGuest, setIsGuest] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsGuest(false);
    } catch (err: any) {
      setError('E-mail ou senha incorretos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If loading, show a clean splash
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-2xl bg-brand-blue/20 flex items-center justify-center"
        >
          <Dumbbell className="w-8 h-8 text-brand-blue" />
        </motion.div>
      </div>
    );
  }

  // If not logged in and not a guest, show the PREMIUM LANDING GATE (Start Screen)
  if (!user && !isGuest) {
    return (
      <div className="min-h-screen bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center p-6 sm:p-12">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-blue/10 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-blue/5 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 grayscale" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-[420px] flex flex-col items-center gap-10"
        >
          {/* Official Style Logo */}
          <div className="flex flex-col items-center gap-6">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative w-40 h-40 flex items-center justify-center"
            >
              {/* Logo Glow & Border Base */}
              <div className="absolute inset-0 bg-brand-blue/30 blur-[60px] rounded-full animate-pulse" />
              <div className="absolute inset-0 rounded-[2.5rem] bg-neon-gradient p-[2px] shadow-[0_0_50px_rgba(0,240,255,0.5)]">
                <div className="w-full h-full bg-[#080808] rounded-[2.5rem] flex items-center justify-center p-4 backdrop-blur-xl border border-white/10">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1BxpKNGytewZt0036i8tEqbhw6WIzcNzH" 
                    alt="Marcos Vinicius Logo"
                    className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </motion.div>
            <div className="text-center space-y-1">
              <h1 className="text-3xl font-display font-black text-white tracking-tighter uppercase leading-none">
                MARCOS <span className="text-brand-blue">VINICIUS</span>
              </h1>
              <p className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase">PERSONAL TRAINER</p>
            </div>
          </div>

          <div className="w-full space-y-4">
            {/* Student Login Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)] space-y-8 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="space-y-1 text-center relative z-10">
                <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter leading-none">ÁREA DO ALUNO</h2>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-[1px] w-4 bg-brand-blue/30" />
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Portal de Treinamento</p>
                  <div className="h-[1px] w-4 bg-brand-blue/30" />
                </div>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4 relative z-10">
                <div className="space-y-2 font-sans">
                  <div className="relative group/input">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within/input:text-brand-blue transition-colors" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="E-mail do Aluno"
                      className="w-full bg-[#080808] border border-white/5 rounded-full py-5 pl-14 pr-8 text-white text-sm placeholder:text-white/10 focus:outline-none focus:border-brand-blue/40 focus:bg-brand-blue/5 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2 font-sans">
                  <div className="relative group/input">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within/input:text-brand-blue transition-colors" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Senha de Acesso"
                      className="w-full bg-[#080808] border border-white/5 rounded-full py-5 pl-14 pr-8 text-white text-sm placeholder:text-white/10 focus:outline-none focus:border-brand-blue/40 focus:bg-brand-blue/5 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-2xl py-3 px-4"
                  >
                    <p className="text-red-400 text-[10px] font-black uppercase text-center tracking-widest">{error}</p>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white py-5 rounded-full font-black uppercase tracking-[0.25em] shadow-[0_20px_40px_rgba(0,240,255,0.25)] glow-blue disabled:opacity-50 flex items-center justify-center gap-3 transition-all text-[11px]"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 rotate-180" />
                      ACESSAR PORTAL VIP
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Visitor Path */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsGuest(true)}
              className="w-full group bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full py-6 px-10 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-brand-blue group-hover:scale-110 transition-all">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-black text-white uppercase tracking-[0.2em] leading-none mb-1">CONHECER CONSULTORIA</p>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.1em]">Entrar sem identificação</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
            </motion.button>
          </div>

          {/* Social Proof Footer */}
          <div className="flex gap-8 items-center opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
            <span className="text-[9px] font-bold tracking-widest uppercase">Resultados Reais</span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue/50" />
            <span className="text-[9px] font-bold tracking-widest uppercase">Metodologia VIP</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // If logged in, show the student area directly with full layout
  if (user && !isGuest) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-0 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-blue/10 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5 grayscale" />
        </div>
        <StudentArea onClose={() => setIsGuest(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center px-4 pt-12 pb-24 overflow-x-hidden relative">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-blue/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#00F0FF10,transparent_70%)]" />
      </div>
        
        {/* Floating Header for Visitor Mode */}
        <div className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
          <motion.button 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => setIsGuest(false)}
            className="pointer-events-auto bg-white/5 backdrop-blur-3xl border border-white/10 w-12 h-12 rounded-2xl flex items-center justify-center text-white/50 hover:text-white transition-all shadow-2xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-brand-blue/20 backdrop-blur-xl border border-brand-blue/30 px-5 py-2.5 rounded-2xl shadow-[0_10px_30px_rgba(0,240,255,0.1)]"
          >
            <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em]">Módulo Visitante</span>
          </motion.div>
        </div>
        
        {/* Bottom CTA to return to login */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <button 
            onClick={() => setIsGuest(false)}
            className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full px-8 py-4 flex items-center gap-3 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-2xl group"
          >
            <LogOut className="w-4 h-4 text-brand-blue group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Sair da Consulta</span>
          </button>
        </div>
      
      <div className="w-full max-w-[480px] space-y-12 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-10"
        >
          {/* Official Style Logo for Visitor Area */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-brand-blue/30 blur-[80px] rounded-full animate-pulse-glow" />
            <div className="relative w-40 h-40 rounded-[2.5rem] bg-neon-gradient p-[2px] shadow-[0_20px_70px_rgba(0,255,255,0.5)]">
              <div className="w-full h-full bg-[#0a0a0a] rounded-[2.5rem] flex items-center justify-center p-4 border border-white/10 backdrop-blur-3xl">
                <img 
                  src="https://lh3.googleusercontent.com/d/1BxpKNGytewZt0036i8tEqbhw6WIzcNzH" 
                  alt="Marcos Vinicius Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-display font-black tracking-tighter text-white uppercase leading-none">
              MARCOS <span className="text-brand-blue">VINICIUS</span>
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-6 bg-white/10" />
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.5em] whitespace-nowrap">
                Personal Trainer <span className="text-brand-blue">VIP</span>
              </p>
              <div className="h-[1px] w-6 bg-white/10" />
            </div>
          </div>

          {/* Premium Tab Switcher */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-1.5 flex gap-1 shadow-2xl">
            {(['links', 'results', 'about'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative overflow-hidden",
                  activeTab === tab ? "text-white shadow-lg" : "text-white/20 hover:text-white/40"
                )}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="visitorTab"
                    className="absolute inset-0 bg-brand-blue/20 backdrop-blur-sm rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">
                  {tab === 'links' ? 'SERVIÇOS' : tab === 'results' ? 'RESULTADOS' : 'CONSULTORIA'}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'links' && (
            <motion.div
              key="services-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Marketing Hero Card */}
              <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <Target className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter leading-none">SEU MELHOR FÍSICO COMEÇA AQUI</h3>
                    <p className="text-white/40 text-sm leading-relaxed">Personalização absoluta para quem busca resultados de elite em tempo recorde.</p>
                  </div>
                </div>
              </div>

              {/* Highlighted Location Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-blue" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                      Local de Atendimento
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-white/5 ml-4" />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { 
                      name: "Mesquita Gym", 
                      desc: "Estrutura Completa", 
                      url: "https://www.google.com/maps/search/Mesquita+Gym+Arari+MA" 
                    },
                    { 
                      name: "Strong CT", 
                      desc: "Treinamento Funcional", 
                      url: "https://www.google.com/maps/search/Strong+CT+Arari+MA" 
                    }
                  ].map((loc, idx) => (
                    <motion.a
                      key={idx}
                      href={loc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white/5 border border-white/5 hover:border-brand-blue/30 rounded-3xl p-5 flex items-center justify-between transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1">{loc.name}</p>
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{loc.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black text-brand-blue/40 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Ver no Mapa</span>
                        <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-brand-blue transition-all" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {LINKS.slice(0, 1).map((link, idx) => (
                  <motion.a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-neon-gradient text-white p-8 rounded-[40px] flex items-center justify-between shadow-2xl shadow-brand-blue/20 glow-blue group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center">
                        <Zap className="w-7 h-7 fill-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black uppercase tracking-widest leading-none mb-1">CONHECER CONSULTORIA VIP</p>
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Atendimento 1-on-1 exclusivo</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                  </motion.a>
                ))}

                <div className="grid grid-cols-1 gap-4">
                  {SERVICES.slice(0, 3).map((service, index) => (
                    <motion.a
                      key={index}
                      href={`${WHATSAPP_BASE_URL}?text=${encodeURIComponent(service.message)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-[32px] p-6 flex items-center justify-between transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
                          {service.icon}
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-white uppercase tracking-widest">{service.title}</p>
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Saiba Mais</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-white/20 group-hover:text-brand-blue group-hover:border-brand-blue transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Mega CTA WhatsApp */}
              <motion.a
                href={`${WHATSAPP_BASE_URL}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white py-7 rounded-[35px] font-black uppercase tracking-[0.25em] text-center flex items-center justify-center gap-4 shadow-xl shadow-green-500/10 transition-all text-sm"
              >
                <MessageCircle className="w-6 h-6 fill-white" />
                QUERO MEU TREINO AGORA
              </motion.a>
            </motion.div>
          )}

          {activeTab === 'results' && (
            <motion.div
              key="results-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-8">
                {RESULTS.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative h-[540px] bg-white/5 border border-white/10 rounded-[50px] overflow-hidden"
                  >
                    <img 
                      src={result.image} 
                      alt={result.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                      <div className="space-y-2">
                        <div className="bg-brand-blue/90 backdrop-blur-md px-4 py-1.5 rounded-full inline-block text-[9px] font-black uppercase tracking-widest text-black">
                          {result.type}
                        </div>
                        <h4 className="text-3xl font-display font-black text-white uppercase tracking-tighter leading-none">{result.result}</h4>
                        <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.3em]">Transformação: {result.name}</p>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl">
                        <Activity className="w-6 h-6 text-brand-blue" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.a
                href={`${WHATSAPP_BASE_URL}?text=${encodeURIComponent("Olá Marcos! Vi os resultados dos seus alunos e quero ser o próximo. Vamos começar?")}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-[35px] py-7 font-black uppercase tracking-widest text-white text-center flex items-center justify-center gap-3 transition-all"
              >
                Ver Mais Resultados no Instagram
                <ChevronRight className="w-5 h-5" />
              </motion.a>
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white/5 border border-white/10 rounded-[50px] overflow-hidden relative">
                <div className="aspect-[4/3] relative">
                  <img src="https://images.unsplash.com/photo-1571019623452-47fc61b18ed8?q=80&w=2070&auto=format&fit=crop" alt="Personal" className="w-full h-full object-cover grayscale brightness-75" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-10 left-10">
                    <h3 className="text-4xl font-display font-black text-white uppercase leading-none mb-2">METODOLOGIA</h3>
                    <p className="text-brand-blue text-sm font-black uppercase tracking-widest">Ciência e Disciplina</p>
                  </div>
                </div>

                <div className="p-12 space-y-10">
                  <p className="text-white/60 text-lg leading-relaxed font-medium">
                    Minha missão é simples: <span className="text-white font-black">Excelência em Performance.</span> Não ofereço atalhos, ofereço o caminho mais inteligente para atingir sua melhor versão estética e funcional.
                  </p>

                  <div className="grid grid-cols-1 gap-6">
                    {[
                      { icon: <Monitor className="w-5 h-5" />, title: "SUPORTE 24/7", desc: "Acompanhamento direto via WhatsApp." },
                      { icon: <ClipboardList className="w-5 h-5" />, title: "DIETA DE ELITE", desc: "Plano alimentar 100% estratégico." },
                      { icon: <Activity className="w-5 h-5" />, title: "PERIODIZAÇÃO", desc: "Treinos atualizados para sua evolução." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue/10 transition-all">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-xs font-black text-white uppercase tracking-widest">{item.title}</p>
                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pb-4">
                    <div className="bg-white/5 rounded-3xl p-6 text-center border border-white/5">
                      <div className="text-3xl font-black text-white mb-1">8+</div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Anos Exp.</div>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-6 text-center border border-white/5">
                      <div className="text-3xl font-black text-white mb-1">+200</div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Alunos VIP</div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.a
                href={`${WHATSAPP_BASE_URL}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="bg-neon-gradient text-white py-7 rounded-[35px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-blue/20 glow-blue text-center block"
              >
                ESCOLHER MEU PLANO
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="text-center space-y-6 pt-12 pb-12 border-t border-white/5 w-full mt-auto">
          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="flex flex-col items-center">
              <span className="text-white font-black text-lg">100%</span>
              <span className="text-[8px] text-white/30 uppercase tracking-widest">Seguro</span>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div className="flex flex-col items-center">
              <span className="text-white font-black text-lg">24/7</span>
              <span className="text-[8px] text-white/30 uppercase tracking-widest">Suporte</span>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div className="flex flex-col items-center">
              <span className="text-white font-black text-lg">Elite</span>
              <span className="text-[8px] text-white/30 uppercase tracking-widest">Resultados</span>
            </div>
          </div>
          <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-bold">
            © {new Date().getFullYear()} MARCOS VINICIUS PERSONAL TRAINER
          </p>
        </footer>
      </div>
    </div>
  );
}
