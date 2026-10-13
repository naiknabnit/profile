import React, { useState } from 'react';
import { Mail, ArrowUp, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons';

export const ContactFooter: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const email = 'nabnitnaik@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative pt-24 pb-12 px-6 max-w-7xl mx-auto z-10 border-t border-slate-900">
      {/* Contact Banner */}
      <div className="p-8 md:p-14 rounded-3xl bg-gradient-to-br from-cyan-950/30 via-slate-950 to-indigo-950/30 border border-cyan-500/30 backdrop-blur-xl relative overflow-hidden mb-16 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/50 text-xs font-mono text-cyan-300 tracking-widest uppercase mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>05 // INITIATE TRANSMISSION</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Let's Build Something Extraordinary
          </h2>
          <p className="mt-4 text-slate-300 text-sm md:text-base font-light leading-relaxed">
            Whether you are looking to collaborate on agentic AI pipelines, modern full-stack web applications, or scalable engineering solutions — my inbox and git repos are always open.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <a
              href="https://www.linkedin.com/in/nabnitnaik/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm tracking-wide hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              <LinkedinIcon className="w-4 h-4" />
              <span>Connect on LinkedIn</span>
            </a>

            <button
              onClick={copyEmail}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400/50 text-slate-200 text-sm font-mono transition-all cursor-pointer"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Mail className="w-4 h-4 text-cyan-400" />}
              <span>{copiedEmail ? 'Email Copied!' : 'Copy Direct Email'}</span>
            </button>

            <a
              href="https://github.com/naiknabnit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white text-sm font-mono transition-all"
            >
              <GithubIcon className="w-4 h-4 text-slate-300" />
              <span>Follow on GitHub</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-800/80 text-xs font-mono text-slate-400">
        <div>
          <span className="text-slate-300 font-semibold">Nabnit Naik</span> © {new Date().getFullYear()} — Designed with intent • Built with curiosity • Powered by code.
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/naiknabnit"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            GitHub Profile
          </a>
          <a
            href="https://www.unionchurch.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            Union Church Live
          </a>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            title="Scroll to Horizon top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
