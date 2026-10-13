import React, { useState } from 'react';
import { Layers, Sparkles, Cpu, Globe, Database, Cloud, Filter } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface Skill {
  name: string;
  category: 'ai' | 'frontend' | 'backend' | 'cloud';
  level: string;
  icon: string;
  desc: string;
  size: 'lg' | 'md' | 'sm';
  floatClass: string;
  colorBorder: string;
  colorBg: string;
  glowColor: string;
}

export const TechStackSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'frontend' | 'backend' | 'cloud'>('all');
  const [activeView, setActiveView] = useState<'bubbles' | 'grid'>('bubbles');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const categories = [
    { id: 'all', label: 'All Ecosystem', icon: Layers },
    { id: 'ai', label: 'AI & Intelligence', icon: Cpu },
    { id: 'frontend', label: 'Frontend & UI', icon: Globe },
    { id: 'backend', label: 'Backend & Data', icon: Database },
    { id: 'cloud', label: 'Cloud & DevOps', icon: Cloud },
  ];

  const skills: Skill[] = [
    // AI
    {
      name: 'LLMs',
      category: 'ai',
      level: 'Advanced',
      icon: '🤖',
      desc: 'Prompt engineering, fine-tuning, reasoning architectures, function calling',
      size: 'lg',
      floatClass: 'animate-float-slow',
      colorBorder: 'border-cyan-400/50',
      colorBg: 'from-cyan-500/25 to-blue-600/10',
      glowColor: 'shadow-[0_0_35px_rgba(6,182,212,0.45)]',
    },
    {
      name: 'RAG',
      category: 'ai',
      level: 'Advanced',
      icon: '🔍',
      desc: 'Dense vector retrieval, semantic hybrid search & reranking workflows',
      size: 'lg',
      floatClass: 'animate-float-medium',
      colorBorder: 'border-cyan-400/50',
      colorBg: 'from-cyan-500/25 to-teal-600/10',
      glowColor: 'shadow-[0_0_35px_rgba(6,182,212,0.4)]',
    },
    {
      name: 'LangGraph',
      category: 'ai',
      level: 'Proficient',
      icon: '🕸️',
      desc: 'Cyclic stateful multi-agent systems and deterministic workflow graphs',
      size: 'md',
      floatClass: 'animate-float-fast',
      colorBorder: 'border-cyan-400/40',
      colorBg: 'from-cyan-600/20 to-indigo-600/10',
      glowColor: 'shadow-[0_0_25px_rgba(6,182,212,0.35)]',
    },
    {
      name: 'Python',
      category: 'ai',
      level: 'Advanced',
      icon: '🐍',
      desc: 'NumPy, AI agent backends, async microservices & scientific computation',
      size: 'lg',
      floatClass: 'animate-float-slow',
      colorBorder: 'border-emerald-400/50',
      colorBg: 'from-emerald-500/25 to-teal-600/10',
      glowColor: 'shadow-[0_0_35px_rgba(16,185,129,0.4)]',
    },

    // Frontend
    {
      name: 'React 19',
      category: 'frontend',
      level: 'Advanced',
      icon: '⚛️',
      desc: 'Server components, hooks, concurrent transitions, state orchestration',
      size: 'lg',
      floatClass: 'animate-float-medium',
      colorBorder: 'border-indigo-400/50',
      colorBg: 'from-indigo-500/25 to-cyan-600/10',
      glowColor: 'shadow-[0_0_35px_rgba(99,102,241,0.45)]',
    },
    {
      name: 'Next.js',
      category: 'frontend',
      level: 'Advanced',
      icon: '▲',
      desc: 'App router architecture, server actions, dynamic SSG/SSR pipelines',
      size: 'lg',
      floatClass: 'animate-float-slow',
      colorBorder: 'border-slate-300/50',
      colorBg: 'from-slate-700/30 to-slate-900/40',
      glowColor: 'shadow-[0_0_30px_rgba(255,255,255,0.25)]',
    },
    {
      name: 'TypeScript',
      category: 'frontend',
      level: 'Advanced',
      icon: '🔷',
      desc: 'Strict type contracts, generic architectures, compile-time safety',
      size: 'lg',
      floatClass: 'animate-float-fast',
      colorBorder: 'border-blue-400/50',
      colorBg: 'from-blue-500/25 to-indigo-600/10',
      glowColor: 'shadow-[0_0_35px_rgba(59,130,246,0.4)]',
    },
    {
      name: 'Tailwind CSS',
      category: 'frontend',
      level: 'Advanced',
      icon: '🎨',
      desc: 'Token-based design systems, responsive utilities, custom CSS keyframes',
      size: 'md',
      floatClass: 'animate-float-medium',
      colorBorder: 'border-teal-400/40',
      colorBg: 'from-teal-500/20 to-cyan-600/10',
      glowColor: 'shadow-[0_0_25px_rgba(20,184,166,0.35)]',
    },
    {
      name: 'Three.js',
      category: 'frontend',
      level: 'Proficient',
      icon: '🌐',
      desc: '3D WebGL scenes, procedural particle fields, shaders & post-processing',
      size: 'md',
      floatClass: 'animate-float-slow',
      colorBorder: 'border-cyan-400/40',
      colorBg: 'from-cyan-500/20 to-purple-600/10',
      glowColor: 'shadow-[0_0_30px_rgba(6,182,212,0.4)]',
    },
    {
      name: 'GSAP',
      category: 'frontend',
      level: 'Proficient',
      icon: '⚡',
      desc: 'ScrollTrigger physics, staggered timelines, fluid split-text reveals',
      size: 'sm',
      floatClass: 'animate-float-fast',
      colorBorder: 'border-green-400/40',
      colorBg: 'from-green-500/20 to-emerald-600/10',
      glowColor: 'shadow-[0_0_25px_rgba(34,197,94,0.35)]',
    },

    // Backend
    {
      name: 'Node.js',
      category: 'backend',
      level: 'Advanced',
      icon: '🟢',
      desc: 'Event-driven high-throughput API services & real-time socket engines',
      size: 'lg',
      floatClass: 'animate-float-medium',
      colorBorder: 'border-emerald-400/50',
      colorBg: 'from-emerald-500/25 to-green-600/10',
      glowColor: 'shadow-[0_0_35px_rgba(16,185,129,0.4)]',
    },
    {
      name: 'Prisma ORM',
      category: 'backend',
      level: 'Advanced',
      icon: '💎',
      desc: 'Declarative type-safe schemas, automated migrations & relational queries',
      size: 'md',
      floatClass: 'animate-float-slow',
      colorBorder: 'border-teal-400/40',
      colorBg: 'from-teal-500/20 to-blue-600/10',
      glowColor: 'shadow-[0_0_25px_rgba(20,184,166,0.35)]',
    },
    {
      name: 'SQLite',
      category: 'backend',
      level: 'Advanced',
      icon: '💾',
      desc: 'Ultra-fast embedded transactional storage and local edge queries',
      size: 'sm',
      floatClass: 'animate-float-fast',
      colorBorder: 'border-sky-400/40',
      colorBg: 'from-sky-500/20 to-blue-600/10',
      glowColor: 'shadow-[0_0_20px_rgba(56,189,248,0.35)]',
    },
    {
      name: 'MongoDB',
      category: 'backend',
      level: 'Proficient',
      icon: '🍃',
      desc: 'NoSQL document schemas, indexing strategies & aggregation pipelines',
      size: 'sm',
      floatClass: 'animate-float-medium',
      colorBorder: 'border-emerald-400/40',
      colorBg: 'from-emerald-500/20 to-teal-600/10',
      glowColor: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    },
    {
      name: 'Java',
      category: 'backend',
      level: 'Proficient',
      icon: '☕',
      desc: 'Object-oriented patterns, multithreading & algorithmic data structures',
      size: 'md',
      floatClass: 'animate-float-slow',
      colorBorder: 'border-amber-400/40',
      colorBg: 'from-amber-500/20 to-orange-600/10',
      glowColor: 'shadow-[0_0_25px_rgba(245,158,11,0.35)]',
    },
    {
      name: 'C++',
      category: 'backend',
      level: 'Proficient',
      icon: '⚙️',
      desc: 'High-performance computing, memory management & low-level algorithms',
      size: 'sm',
      floatClass: 'animate-float-medium',
      colorBorder: 'border-pink-400/40',
      colorBg: 'from-pink-500/20 to-rose-600/10',
      glowColor: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
    },

    // Cloud & DevOps
    {
      name: 'Docker',
      category: 'cloud',
      level: 'Proficient',
      icon: '🐳',
      desc: 'Container isolation, multi-stage builds & docker-compose configurations',
      size: 'lg',
      floatClass: 'animate-float-slow',
      colorBorder: 'border-blue-400/50',
      colorBg: 'from-blue-500/25 to-sky-600/10',
      glowColor: 'shadow-[0_0_35px_rgba(59,130,246,0.4)]',
    },
    {
      name: 'Kubernetes',
      category: 'cloud',
      level: 'Exploring',
      icon: '☸️',
      desc: 'Pod lifecycle management, container orchestration & scaling primitives',
      size: 'sm',
      floatClass: 'animate-float-fast',
      colorBorder: 'border-indigo-400/40',
      colorBg: 'from-indigo-500/20 to-blue-600/10',
      glowColor: 'shadow-[0_0_20px_rgba(99,102,241,0.3)]',
    },
    {
      name: 'AWS Cloud',
      category: 'cloud',
      level: 'Proficient',
      icon: '☁️',
      desc: 'S3 asset hosting, EC2 instances, serverless Lambda & cloud architecture',
      size: 'md',
      floatClass: 'animate-float-medium',
      colorBorder: 'border-amber-400/40',
      colorBg: 'from-amber-500/20 to-yellow-600/10',
      glowColor: 'shadow-[0_0_25px_rgba(245,158,11,0.35)]',
    },
    {
      name: 'Git & GitHub',
      category: 'cloud',
      level: 'Advanced',
      icon: '🐙',
      desc: 'Collaborative PR workflows, version tracking, automation & CI/CD',
      size: 'md',
      floatClass: 'animate-float-slow',
      colorBorder: 'border-purple-400/40',
      colorBg: 'from-purple-500/20 to-slate-800/10',
      glowColor: 'shadow-[0_0_25px_rgba(168,85,247,0.35)]',
    },
  ];

  const filteredSkills =
    activeTab === 'all' ? skills : skills.filter((s) => s.category === activeTab);

  return (
    <section id="stack" className="relative py-28 px-6 max-w-7xl mx-auto z-10 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header with ScrollReveal */}
      <ScrollReveal direction="up">
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-teal-500/30 bg-teal-950/40 text-xs font-mono text-teal-300 tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>03 // SKILLS & TECH ARSENAL</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Interactive Skills Universe
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl text-base md:text-lg font-light leading-relaxed">
            Hover over floating skill bubbles to explore competencies across Artificial Intelligence,
            modern full-stack engineering, and cloud platforms.
          </p>

          {/* Controls: Filter Pills & View Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 font-mono text-xs backdrop-blur-md">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs">
              <button
                onClick={() => setActiveView('bubbles')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeView === 'bubbles'
                    ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🫧 Floating Bubbles
              </button>
              <button
                onClick={() => setActiveView('grid')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeView === 'grid'
                    ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎴 Hologram Grid
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* VIEW 1: INTERACTIVE BUBBLE CLOUD */}
      {activeView === 'bubbles' && (
        <ScrollReveal direction="up" delay={150}>
          <div className="relative min-h-[500px] p-6 md:p-10 rounded-3xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-2xl shadow-2xl flex flex-wrap items-center justify-center gap-5 md:gap-7 overflow-hidden">
            {/* Background micro bubble specks */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <div className="absolute top-10 left-12 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <div className="absolute bottom-16 right-20 w-4 h-4 rounded-full bg-indigo-400 animate-pulse" />
              <div className="absolute top-1/2 left-10 w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <div className="absolute bottom-10 left-1/3 w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
            </div>

            {filteredSkills.map((skill, idx) => {
              const isSelected = selectedSkill?.name === skill.name;
              const sizeClasses =
                skill.size === 'lg'
                  ? 'w-36 h-36 md:w-40 md:h-40 text-sm'
                  : skill.size === 'md'
                  ? 'w-32 h-32 md:w-36 md:h-36 text-xs'
                  : 'w-28 h-28 md:w-32 md:h-32 text-xs';

              return (
                <div
                  key={skill.name}
                  onClick={() => setSelectedSkill(isSelected ? null : skill)}
                  onMouseEnter={() => setSelectedSkill(skill)}
                  className={`relative group rounded-full flex flex-col items-center justify-center text-center p-3 cursor-pointer transition-all duration-500 ${sizeClasses} ${skill.floatClass} bg-gradient-to-br ${skill.colorBg} border-2 ${skill.colorBorder} backdrop-blur-xl hover:scale-115 hover:z-30 hover:${skill.glowColor}`}
                  style={{
                    animationDelay: `${(idx % 5) * 0.4}s`,
                  }}
                >
                  {/* Glowing bubble rim */}
                  <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-cyan-300/80 transition-colors pointer-events-none" />

                  {/* Icon & Name */}
                  <span className="text-3xl md:text-4xl filter drop-shadow-md group-hover:scale-120 transition-transform duration-300">
                    {skill.icon}
                  </span>
                  <span className="font-bold text-white tracking-wide mt-1 group-hover:text-cyan-300 transition-colors">
                    {skill.name}
                  </span>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 mt-1 uppercase tracking-wider">
                    {skill.level}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active Bubble Inspector HUD */}
          {selectedSkill && (
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-950/90 to-slate-900/90 border border-cyan-500/40 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <div className="flex items-center gap-4">
                <span className="text-4xl p-2 rounded-2xl bg-slate-800/80 border border-slate-700">
                  {selectedSkill.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-white">{selectedSkill.name}</h4>
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                      {selectedSkill.level}
                    </span>
                    <span className="text-[11px] font-mono text-indigo-400 uppercase">
                      // {selectedSkill.category}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 mt-1 font-light">
                    {selectedSkill.desc}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSkill(null)}
                className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
              >
                Close HUD ✕
              </button>
            </div>
          )}
        </ScrollReveal>
      )}

      {/* VIEW 2: HOLOGRAPHIC GRID */}
      {activeView === 'grid' && (
        <ScrollReveal direction="up" delay={150}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSkills.map((skill, index) => (
              <div
                key={index}
                className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(6,182,212,0.18)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{skill.icon}</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700/60 text-cyan-300">
                      {skill.level}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 font-light leading-relaxed">
                    {skill.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-indigo-400 uppercase tracking-widest">{skill.category}</span>
                  <span className="text-slate-400">verified</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Bottom Ecosystem Icons Ribbon */}
      <ScrollReveal direction="up" delay={250}>
        <div className="mt-12 p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md flex flex-col items-center text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">
            Official Developer Badges & Ecosystem Matrix
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            <img
              src="https://skillicons.dev/icons?i=python,java,cpp,js,ts,react,nextjs,nodejs,prisma,sqlite,mongodb,aws,docker,kubernetes,git,github&theme=dark"
              alt="Nabnit Naik Skill Icons"
              className="max-w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
