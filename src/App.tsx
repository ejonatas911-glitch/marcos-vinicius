/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  CheckCircle2
} from 'lucide-react';
import { cn } from './lib/utils';

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
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'links' | 'results' | 'about'>('links');

  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center px-4 py-12 sm:py-20 overflow-x-hidden relative">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_-20%,#00F0FF10,transparent_50%)]" />
      
      <div className="w-full max-w-[480px] space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          {/* Previous Header Content ... */}
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-brand-blue/20 blur-[60px] rounded-full animate-pulse-glow" />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [1, 1.03, 1], 
                opacity: 1,
                y: [0, -15, 0],
                rotate: [-3, 0, -3]
              }}
              transition={{ 
                opacity: { duration: 0.5 },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ rotate: 0, scale: 1.1, y: -20 }}
              className="relative w-44 h-44 rounded-[2.5rem] logo-gradient-border p-6 bg-brand-dark overflow-hidden mx-auto shadow-[0_20px_50px_rgba(0,255,255,0.2)] transition-all duration-500 z-10"
            >
              <img 
                src="https://lh3.googleusercontent.com/d/1mR08Vwo5fD07OFxlU9eeH2HIVbiy43Fb" 
                alt="Marcos Vinicius Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          <div className="space-y-3 pt-4">
            <h1 className="text-4xl font-display font-black tracking-tight text-white uppercase glow-text-neon">
              MARCOS <span className="text-neon-gradient">PERSONAL</span>
            </h1>
            <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed">
              Transformando corpos e mentes através do treinamento de <span className="text-brand-blue font-bold">alto rendimento</span>.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 max-w-[400px] mx-auto">
            <button 
              onClick={() => setActiveTab('links')}
              className={cn(
                "flex-1 py-3 px-2 rounded-xl text-[10px] font-bold transition-all duration-300",
                activeTab === 'links' ? "bg-neon-gradient text-white shadow-lg" : "text-white/40 hover:text-white/60"
              )}
            >
              LINKS
            </button>
            <button 
              onClick={() => setActiveTab('results')}
              className={cn(
                "flex-1 py-3 px-2 rounded-xl text-[10px] font-bold transition-all duration-300",
                activeTab === 'results' ? "bg-neon-gradient text-white shadow-lg" : "text-white/40 hover:text-white/60"
              )}
            >
              RESULTADOS
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={cn(
                "flex-1 py-3 px-2 rounded-xl text-[10px] font-bold transition-all duration-300",
                activeTab === 'about' ? "bg-neon-gradient text-white shadow-lg" : "text-white/40 hover:text-white/60"
              )}
            >
              QUEM SOU
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'links' && (
            <motion.div
              key="links-tab"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-12"
            >
              {/* Main CTA - Venha Fazer Parte */}
              <motion.a
                href={`${WHATSAPP_BASE_URL}?text=${encodeURIComponent("Olá Marcos! Quero fazer parte do seu time de campeões e transformar meu físico agora mesmo!")}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: [1, 1.02, 1],
                  filter: ["drop-shadow(0 0 10px rgba(0,255,255,0.3))", "drop-shadow(0 0 25px rgba(0,255,255,0.6))", "drop-shadow(0 0 10px rgba(0,255,255,0.3))"]
                }}
                transition={{ 
                  opacity: { delay: 0.2 },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  filter: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3 w-full bg-neon-gradient text-white py-6 rounded-[2rem] font-display font-black text-lg shadow-[0_20px_40px_rgba(0,255,255,0.3)] glow-blue relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Flame className="w-6 h-6 fill-white" />
                </motion.div>
                <span className="tracking-widest uppercase">VENHA FAZER PARTE</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              {/* Links Section */}
              <div className="space-y-4">
                {LINKS.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "group relative flex items-center p-4 rounded-2xl transition-all duration-300",
                      link.highlight 
                        ? "bg-neon-gradient text-white glow-blue" 
                        : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mr-4",
                      link.highlight ? "bg-white/20" : "bg-brand-blue/10 text-brand-blue drop-shadow-[0_0_5px_rgba(0,240,255,0.4)]"
                    )}>
                      {link.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{link.title}</h3>
                      <p className={cn(
                        "text-xs mt-0.5",
                        link.highlight ? "text-white/80" : "text-white/40"
                      )}>
                        {link.description}
                      </p>
                    </div>

                    <ChevronRight className={cn(
                      "w-5 h-5 transition-transform group-hover:translate-x-1",
                      link.highlight ? "text-white/50" : "text-white/20"
                    )} />
                  </motion.a>
                ))}
              </div>

              {/* Services Section */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between px-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Especialidades
                  </span>
                  <div className="h-px flex-1 bg-white/5 ml-4" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {SERVICES.map((service, index) => (
                    <motion.button 
                      key={index}
                      onClick={() => setSelectedService(index)}
                      whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-3 bg-white/[0.02] border rounded-xl transition-all duration-300 cursor-pointer text-left",
                        selectedService === index ? "border-brand-blue bg-white/[0.05]" : "border-white/5"
                      )}
                    >
                      <div className="flex-shrink-0">
                        {service.icon}
                      </div>
                      <span className="text-[10px] sm:text-xs font-semibold text-white/70 leading-tight">
                        {service.title}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {selectedService !== null && (
                    <motion.div
                      key={selectedService}
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="bg-brand-blue/5 border border-brand-blue/20 rounded-2xl p-6 relative group overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-2">
                        <button 
                          onClick={() => setSelectedService(null)}
                          className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 rotate-90 text-white/40" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-brand-blue/20 flex items-center justify-center text-brand-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
                          {SERVICES[selectedService].icon}
                        </div>
                        <h4 className="font-bold text-white text-lg">
                          {SERVICES[selectedService].title}
                        </h4>
                      </div>
                      
                      <p className="text-white/60 text-sm leading-relaxed mb-6">
                        {SERVICES[selectedService].description}
                      </p>

                      <motion.a 
                        href={`${WHATSAPP_BASE_URL}?text=${encodeURIComponent(SERVICES[selectedService].message)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 w-full bg-neon-gradient hover:bg-brand-blue-hover text-white py-3 rounded-xl font-bold text-xs transition-all shadow-lg shadow-brand-blue/20"
                      >
                        <MessageCircle className="w-4 h-4" />
                        SOLICITAR INFORMAÇÕES
                      </motion.a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'results' && (
            <motion.div
              key="results-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6">
                {RESULTS.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <img 
                        src={result.image} 
                        alt={result.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-60" />
                      <div className="absolute top-4 left-4 bg-neon-gradient backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
                        {result.type}
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <h4 className="text-white font-bold text-lg mb-1">{result.name}</h4>
                      <p className="text-neon-gradient font-black text-sm uppercase tracking-widest">{result.result}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.a
                href={`${WHATSAPP_BASE_URL}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 w-full bg-neon-gradient text-white py-6 rounded-[2rem] font-bold shadow-2xl shadow-brand-blue/20 glow-blue transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span>QUERO SER O PRÓXIMO RESULTADO</span>
              </motion.a>
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-blue/10 blur-[80px] rounded-full" />
                
                <h3 className="text-2xl font-display font-black text-white glow-text-neon uppercase tracking-wider">QUEM SOU EU</h3>
                
                <p className="text-white/70 text-sm leading-[1.8] font-medium">
                  Sou <span className="text-neon-gradient font-bold glow-text-neon">Marcos Vinícius</span>, Personal Trainer especializado em transformar vidas através do treino. Trabalho com foco em resultados reais, disciplina e evolução constante, oferecendo acompanhamento personalizado para que cada aluno alcance seu melhor físico e mental.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Evolução</p>
                    <p className="text-xs font-bold text-white">Foco Constante</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Método</p>
                    <p className="text-xs font-bold text-white">Resultados Reais</p>
                  </div>
                </div>
              </div>

              <motion.a
                href={`${WHATSAPP_BASE_URL}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 w-full bg-neon-gradient text-white py-6 rounded-[2rem] font-bold shadow-2xl shadow-brand-blue/20 glow-blue"
              >
                <MessageCircle className="w-5 h-5" />
                <span>INICIAR MINHA TRANSFORMAÇÃO</span>
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="text-center space-y-6 pt-12 pb-8 border-t border-white/5">
          <p className="text-[10px] text-white/20 uppercase tracking-widest font-medium">
            © {new Date().getFullYear()} Marcos Vinicius Trainer
          </p>
          <div className="flex items-center justify-center gap-6">
            <motion.a 
              href="https://www.instagram.com/viniciusmarcos95647?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              className="text-white/30 hover:text-brand-blue transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </motion.a>
            <motion.a 
              href={`${WHATSAPP_BASE_URL}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`} 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              className="text-white/30 hover:text-brand-blue transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </motion.a>
          </div>
        </footer>
      </div>
    </div>
  );
}
