import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, ArrowRight, X, Volume2, ShieldCheck, Heart } from 'lucide-react';

interface WelcomeOverlayProps {
  onEnter: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({
  onEnter,
  isOpen = true,
  onClose,
}) => {
  const [visible, setVisible] = useState(isOpen);
  const [typingIndex, setTypingIndex] = useState(0);

  const fullWelcomeText =
    "Welcome to my creative universe! I am Nabnit Naik — a Computer Science Engineer passionate about building agentic AI systems, scalable full-stack applications, and impactful software products. Step inside and explore my code, experiments, and digital craftsmanship.";

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  // Typewriter effect for welcome text
  useEffect(() => {
    if (!visible) return;
    setTypingIndex(0);
    const interval = setInterval(() => {
      setTypingIndex((prev) => {
        if (prev < fullWelcomeText.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 18);
    return () => clearInterval(interval);
  }, [visible]);

  // Press Enter to enter experience
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && visible) {
        handleEnter();
      } else if (e.key === 'Escape' && visible) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  const handleEnter = () => {
    setVisible(false);
    onEnter();
  };

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 transition-all duration-700 animate-in fade-in select-none">
      {/* Background ambient cosmic glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none" />

      {/* Futuristic Holographic Card */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-950/90 border border-cyan-500/40 p-6 md:p-10 backdrop-blur-3xl shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Animated Cyber Border Beam */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 animate-pulse" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase">
              TRANSMISSION // INCOMING GREETING
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Dismiss Welcome Note"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Central Content with Avatar & Welcome Note */}
        <div className="py-8 flex flex-col items-center text-center">
          {/* Avatar with Pulsing Radar Ring */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-cyan-400/70 p-0.5 shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              <img
                src="https://avatars.githubusercontent.com/u/175724208?v=4"
                alt="Nabnit Naik"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute -inset-2 rounded-2xl border border-cyan-400/30 animate-pulse pointer-events-none" />
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-400 text-[10px] font-mono text-cyan-300 font-bold">
              ITER CSE
            </span>
          </div>

          {/* Welcome Heading */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PERSONAL WELCOME NOTE</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            Hello, Welcome to My Space!
          </h2>

          <div className="text-sm font-mono text-cyan-400 mt-1 mb-4">
            I AM <span className="text-white font-bold tracking-wider">NABNIT NAIK</span> (ナブニット)
          </div>

          {/* Typewriter Welcome Paragraph */}
          <div className="w-full min-h-[90px] p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left font-mono text-xs md:text-sm text-slate-200 leading-relaxed relative">
            <Terminal className="w-4 h-4 text-cyan-400 inline-block mr-2" />
            <span>{fullWelcomeText.slice(0, typingIndex)}</span>
            <span className="inline-block w-1.5 h-4 ml-1 bg-cyan-400 animate-pulse align-middle" />
          </div>

          {/* Quote Badge */}
          <div className="mt-5 italic text-sm text-slate-400 font-light">
            "Curious by nature. Builder by choice."
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Portfolio of Nabnit Naik</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              Skip Intro [Esc]
            </button>

            <button
              onClick={handleEnter}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs font-mono tracking-wider transition-all shadow-[0_0_25px_rgba(6,182,212,0.5)] cursor-pointer hover:scale-105"
            >
              <span>ENTER EXPERIENCE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
