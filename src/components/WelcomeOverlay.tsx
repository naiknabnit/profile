import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, GithubIcon, LinkedinIcon, Sparkles } from 'lucide-react';
onEnter: () => void;
onEnter: () => void; onclose ?: () => void;
}

export const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({
  onEnter,
  isOpen = true,
  onClose,
}) => {
  const [visible, setVisible] = useState(isOpen);
  const [phase, setPhase] = useState<'loading' | 'landing'>('loading');
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const rafRef = useRef<number | null>(null);

  /* ── Sync with parent isOpen ── */
  useEffect(() => {
    setVisible(isOpen);
    if (isOpen) {
      setPhase('loading');
      setProgress(0);
      setExiting(false);
    }
  }, [isOpen]);

  /* ── Preloader counter 0 → 100 over ~2.4 s ── */
  useEffect(() => {
    if (!visible || phase !== 'loading') return;

    const start = performance.now();
    const duration = 2400;

    const tick = (now: number) => {
      const pct = Math.min(((now - start) / duration) * 100, 100);
      setProgress(Math.floor(pct));
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Brief pause then flip to landing
        setTimeout(() => setPhase('landing'), 350);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible, phase]);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!visible) return;
      if (e.key === 'Enter') doEnter();
      if (e.key === 'Escape') doClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible]);

  const doEnter = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onEnter();
    }, 650);
  };

  const doClose = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
      else onEnter();
    }, 650);
  };

  if (!visible) return null;

  return (
    <div
      className={`welcome-root ${exiting ? 'welcome-root--exit' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio landing screen"
    >
      {/* ── Ambient cosmic blobs ── */}
      <div className="welcome-blob welcome-blob--cyan" aria-hidden="true" />
      <div className="welcome-blob welcome-blob--indigo" aria-hidden="true" />
      <div className="welcome-blob welcome-blob--purple" aria-hidden="true" />

      {/* ================================================================
          PHASE 1: PRELOADER
          ================================================================ */}
      <div className={`welcome-phase welcome-preloader ${phase === 'loading' ? 'welcome-phase--active' : 'welcome-phase--gone'}`}>
        {/* HUD rings */}
        <div className="hud-rings" aria-hidden="true">
          <div className="hud-ring hud-ring--1" />
          <div className="hud-ring hud-ring--2" />
          <div className="hud-ring hud-ring--3" />
          <div className="hud-ring hud-ring--4" />
          {/* Dashed inner ring */}
          <div className="hud-ring hud-ring--dash" />
          {/* Counter */}
          <div className="hud-center">
            <span className="hud-pct">{progress}</span>
            <span className="hud-pct-sign">%</span>
          </div>
        </div>

        {/* Labels */}
        <p className="preloader-label-top">PORTFOLIO LOADING</p>
        <p className="preloader-label-bottom">PREPARING INTERFACE</p>

        {/* Progress bar */}
        <div className="preloader-bar-track" aria-hidden="true">
          <div className="preloader-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <p className="preloader-name">NABNIT NAIK</p>
      </div>

      {/* ================================================================
          PHASE 2: LANDING HERO
          ================================================================ */}
      <div className={`welcome-phase welcome-landing ${phase === 'landing' ? 'welcome-phase--active' : 'welcome-phase--hidden'}`}>

        {/* LEFT column */}
        <div className="landing-left">

          {/* Badge */}
          <div className="landing-badge">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>WELCOME TO MY PORTFOLIO</span>
          </div>

          {/* Greeting */}
          <h1 className="landing-heading">
            Hi, I'm{' '}
            <span className="landing-name-accent">Nabnit</span>
          </h1>

          {/* Sub-heading */}
          <p className="landing-role">
            Computer Science Engineer
          </p>
          <p className="landing-subtitle">
            I build agentic AI systems, scalable full-stack apps, and impactful software products.
          </p>

          {/* Tagline */}
          <p className="landing-tagline">
            "Curious by nature. Builder by choice."
          </p>

          {/* CTAs */}
          <div className="landing-ctas">
            <button
              id="welcome-enter-btn"
              onClick={doEnter}
              className="landing-cta-primary"
            >
              ENTER PORTFOLIO
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={doClose}
              className="landing-cta-secondary"
            >
              SKIP INTRO
            </button>
          </div>

          {/* Social row */}
          <div className="landing-socials">
            <a
              href="https://github.com/naiknabnit"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-social-link"
              aria-label="GitHub"
            >
              <Github className="w-4.5 h-4.5" />
            </a>
            <a
              href="https://www.linkedin.com/in/nabnitnaik/"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-social-link"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4.5 h-4.5" />
            </a>
            {/* X / Twitter */}
            <a
              href="https://x.com/naiknabnit"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-social-link"
              aria-label="X (Twitter)"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>

          {/* Keyboard hint */}
          <p className="landing-keyboard-hint">
            Press <kbd>Enter</kbd> to continue · <kbd>Esc</kbd> to skip
          </p>
        </div>

        {/* RIGHT column — avatar card */}
        <div className="landing-right">
          <div className="landing-avatar-card">
            {/* Glow halo behind card */}
            <div className="landing-avatar-glow" aria-hidden="true" />

            {/* Photo */}
            <div className="landing-avatar-photo-wrap">
              <img
                src="https://avatars.githubusercontent.com/u/175724208?v=4"
                alt="Nabnit Naik"
                className="landing-avatar-photo"
                loading="eager"
              />
            </div>

            {/* Floating chips */}
            <div className="landing-chip landing-chip--tl">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              AVAILABLE
            </div>
            <div className="landing-chip landing-chip--br">
              ITER CSE
            </div>

            {/* Scan-line overlay */}
            <div className="landing-avatar-scanline" aria-hidden="true" />
          </div>

          {/* Stats row below avatar */}
          <div className="landing-stats">
            <div className="landing-stat">
              <span className="landing-stat-value">AI</span>
              <span className="landing-stat-label">Systems</span>
            </div>
            <div className="landing-stat-sep" />
            <div className="landing-stat">
              <span className="landing-stat-value">Full</span>
              <span className="landing-stat-label">Stack</span>
            </div>
            <div className="landing-stat-sep" />
            <div className="landing-stat">
              <span className="landing-stat-value">Cloud</span>
              <span className="landing-stat-label">Native</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
