import React, { useState } from 'react';
import { User, Cpu, Globe, Cloud, Sparkles, Code2, Copy, Check, Terminal } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface AboutSectionProps {
  githubUser: {
    login: string;
    name: string;
    avatar_url: string;
    bio: string | null;
    company: string | null;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
  } | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ githubUser }) => {
  const [copied, setCopied] = useState(false);

  const copyProfileJson = () => {
    if (!githubUser) return;
    navigator.clipboard.writeText(JSON.stringify(githubUser, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pillars = [
    {
      icon: Cpu,
      title: 'AI & Agentic Systems',
      desc: 'LLMs, RAG architectures, LangGraph pipelines, and autonomous agent systems designed for intelligent decision-making.',
      color: 'from-cyan-500/20 to-blue-500/5',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
    },
    {
      icon: Globe,
      title: 'Modern Full-Stack Web',
      desc: 'Crafting performant web applications using Next.js, React, TypeScript, Tailwind CSS, Prisma, and robust REST/GraphQL APIs.',
      color: 'from-indigo-500/20 to-purple-500/5',
      borderColor: 'border-indigo-500/30',
      iconColor: 'text-indigo-400',
    },
    {
      icon: Cloud,
      title: 'Cloud & Infrastructure',
      desc: 'Containerization with Docker, Kubernetes workflows, AWS cloud integrations, and reproducible developer environments.',
      color: 'from-teal-500/20 to-emerald-500/5',
      borderColor: 'border-teal-500/30',
      iconColor: 'text-teal-400',
    },
    {
      icon: Code2,
      title: 'Software Engineering',
      desc: 'Clean code principles, scalable system architecture, and turning ambitious concepts into practical, production-ready software.',
      color: 'from-amber-500/20 to-orange-500/5',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <section id="about" className="relative py-28 px-6 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <ScrollReveal direction="up">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-xs font-mono text-cyan-300 tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Terminal className="w-3.5 h-3.5" />
            <span>01 // PERSONA & ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Architecting Intelligence & Web
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl text-base md:text-lg font-light leading-relaxed">
            Computer Science Engineering student passionate about combining generative AI,
            agentic workflows, and modern web craftsmanship.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-5">
          <ScrollReveal direction="left" delay={100}>
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 hover:border-cyan-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/15 transition-all" />

              {/* Profile Header */}
              <div className="flex items-center gap-5 pb-6 border-b border-slate-800/80">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-400/50 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <img
                      src={githubUser?.avatar_url || 'https://avatars.githubusercontent.com/u/175724208?v=4'}
                      alt="Nabnit Naik"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" title="Online / Open to collaborate" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white tracking-wide">
                    {githubUser?.name || 'Nabnit Naik'}
                  </h3>
                  <p className="text-sm font-mono text-cyan-400">
                    @{githubUser?.login || 'naiknabnit'}
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[11px] font-mono text-slate-300">
                    <span className="text-indigo-400 font-semibold uppercase">Affiliation:</span>
                    <span>{githubUser?.company || 'iter'} CSE</span>
                  </div>
                </div>
              </div>

              {/* Quote & Bio */}
              <div className="py-6 border-b border-slate-800/80">
                <blockquote className="text-slate-300 italic text-sm md:text-base border-l-2 border-cyan-400/80 pl-4 py-1">
                  "Curious by nature. Builder by choice."
                </blockquote>
                <p className="mt-4 text-xs md:text-sm text-slate-400 leading-relaxed font-light">
                  Hi, I'm Nabnit — currently focused on bridging deep learning models,
                  RAG pipelines, and interactive web frontends into seamless digital products.
                </p>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-3 py-6 border-b border-slate-800/80 text-center font-mono">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                  <div className="text-2xl font-bold text-cyan-400">{githubUser?.public_repos ?? 4}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Repositories</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                  <div className="text-2xl font-bold text-indigo-400">{githubUser?.followers ?? 1}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Followers</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                  <div className="text-2xl font-bold text-teal-400">2024+</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">GitHub Active</div>
                </div>
              </div>

              {/* GitHub Raw Spec inspector button */}
              <div className="pt-4 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Verified GitHub Identity
                </span>
                <button
                  onClick={copyProfileJson}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: 4 Engineering Pillars */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <ScrollReveal key={idx} direction="up" delay={idx * 80 + 150}>
                <div
                  className={`bg-gradient-to-br ${pillar.color} bg-slate-950/80 border ${pillar.borderColor} rounded-2xl p-6 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 shadow-lg group h-full`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center mb-4 group-hover:border-cyan-400/50 transition-colors">
                    <Icon className={`w-5 h-5 ${pillar.iconColor}`} />
                  </div>
                  <h4 className="text-base font-bold text-white tracking-wide mb-2 flex items-center gap-2">
                    {pillar.title}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}

          {/* Current Focus Card */}
          <div className="sm:col-span-2">
            <ScrollReveal direction="up" delay={400}>
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Active Engineering Focus
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Current Q4 Goals</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-indigo-400 font-bold block mb-1">01 / INTELLIGENCE</span>
                    <span className="text-slate-300">LLM fine-tuning, RAG with vector DBs, LangGraph multi-agent teams</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-cyan-400 font-bold block mb-1">02 / ARCHITECTURE</span>
                    <span className="text-slate-300">High-throughput Next.js & React 19 apps, Prisma ORM, state workflows</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-teal-400 font-bold block mb-1">03 / DEVOPS</span>
                    <span className="text-slate-300">Docker containerization, AWS microservices, automated CI/CD</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
