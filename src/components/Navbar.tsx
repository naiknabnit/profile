import React, { useState, useEffect } from 'react';
import { ExternalLink, Terminal, Sparkles, Menu, X, MessageSquareQuote } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenWelcome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenWelcome }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Horizon', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Stack', id: 'stack' },
    { label: 'Repos', id: 'repos' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-cyan-500/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.7)] transition-all">
            <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center">
              <Terminal className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="font-mono text-sm font-bold text-white tracking-wider flex items-center gap-2">
              NABNIT NAIK
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            </div>
            <div className="text-[10px] font-mono text-cyan-400/70 tracking-widest uppercase">
              AI // FULL-STACK
            </div>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-800/80 shadow-inner">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className="px-3.5 py-1 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-full transition-all cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Social / External CTAs + Welcome Note Trigger */}
        <div className="hidden sm:flex items-center gap-2.5">
          {onOpenWelcome && (
            <button
              onClick={onOpenWelcome}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer hover:scale-105"
              title="Open Welcome Transmission"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Welcome Note</span>
            </button>
          )}

          <a
            href="https://github.com/naiknabnit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/40 rounded-lg transition-all shadow-sm"
          >
            <GithubIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/nabnitnaik/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/40 rounded-lg transition-all shadow-sm"
          >
            <LinkedinIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>LinkedIn</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-cyan-500/20 px-6 py-4 flex flex-col gap-3 backdrop-blur-xl">
          {onOpenWelcome && (
            <button
              onClick={() => {
                onOpenWelcome();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-sm font-mono text-cyan-300 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Open Welcome Note</span>
            </button>
          )}

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-sm font-mono text-slate-300 hover:text-cyan-300"
            >
              # {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex gap-3">
            <a
              href="https://github.com/naiknabnit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg text-slate-300 flex items-center justify-center gap-1.5"
            >
              <GithubIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/nabnitnaik/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg text-slate-300 flex items-center justify-center gap-1.5"
            >
              <LinkedinIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
