import React, { useState } from 'react';
import { ExternalLink, Sparkles, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './icons';
import { ScrollReveal } from './ScrollReveal';

export const ProjectsSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'ai' | 'web'>('all');

  const projects = [
    {
      id: 'agentic-ai',
      category: 'ai',
      categoryLabel: 'AI & Autonomous Systems',
      title: 'Agentic AI Workflows',
      description:
        'Intelligent multi-agent orchestration and retrieval-augmented generation (RAG) platform leveraging LangGraph, vector search, and LLM reasoning pipelines.',
      tags: ['Python', 'RAG', 'LangGraph', 'LLMs', 'ChromaDB'],
      image:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
      githubUrl: 'https://github.com/naiknabnit',
      liveUrl: null,
      featured: true,
      stats: 'Multi-Agent State Machine',
    },
    {
      id: 'carcare-ai',
      category: 'ai',
      categoryLabel: 'AI / Automotive Application',
      title: 'CarCareAI',
      description:
        'Automotive-focused intelligent web application delivering AI-driven diagnostics, smart maintenance scheduling, and vehicle telemetry assistance.',
      tags: ['React', 'JavaScript', 'AI Diagnostics', 'Tailwind CSS', 'Vite'],
      image:
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
      githubUrl: 'https://github.com/naiknabnit/CarCareAI',
      liveUrl: null,
      featured: true,
      stats: 'Automotive AI Core',
    },
    {
      id: 'union-church',
      category: 'web',
      categoryLabel: 'Production Web Platform',
      title: 'Union Church Bhubaneswar',
      description:
        'Full-scale live web system serving the church community with event schedules, announcement portals, robust authentication, and optimized content delivery.',
      tags: ['Next.js', 'React', 'Prisma', 'SQLite', 'NextAuth.js'],
      image:
        'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80',
      githubUrl: 'https://github.com/naiknabnit/cocuc-web',
      liveUrl: 'https://www.unionchurch.in/',
      featured: true,
      stats: '100% Live In Production',
    },
    {
      id: 'website-v',
      category: 'web',
      categoryLabel: 'Creative Web Experiment',
      title: 'website.v Platform',
      description:
        'Lightweight digital canvas testing interactive components, aesthetic typography layouts, and client-side performance micro-optimizations.',
      tags: ['JavaScript', 'HTML5', 'Modern CSS', 'Vite'],
      image:
        'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=900&q=80',
      githubUrl: 'https://github.com/naiknabnit/website.v',
      liveUrl: null,
      featured: false,
      stats: 'Minimalist Architecture',
    },
  ];

  const filteredProjects =
    filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative py-28 px-6 max-w-7xl mx-auto z-10">
      <ScrollReveal direction="up">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-xs font-mono text-indigo-300 tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>02 // SELECTED PORTFOLIO</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Engineered Works & Projects
            </h2>
            <p className="mt-3 text-slate-400 max-w-xl text-sm md:text-base font-light">
              Highlighting core explorations in Artificial Intelligence, autonomous agents,
              and production web platforms.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Works ({projects.length})
            </button>
            <button
              onClick={() => setFilter('ai')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                filter === 'ai'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AI / Agents
            </button>
            <button
              onClick={() => setFilter('web')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                filter === 'web'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Web Applications
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Projects Grid with Staggered ScrollReveal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project, idx) => (
          <ScrollReveal key={project.id} direction="up" delay={idx * 120}>
            <div className="group relative bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(6,182,212,0.18)] flex flex-col justify-between h-full">
              {/* Project Image Banner */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-cyan-300">
                    {project.categoryLabel}
                  </span>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-indigo-950/80 backdrop-blur-md border border-indigo-500/40 text-indigo-300">
                    {project.stats}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-7 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                    {project.title}
                    {project.liveUrl && (
                      <ArrowUpRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    )}
                  </h3>
                  <p className="mt-3 text-sm text-slate-300 font-light leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-7 pt-5 border-t border-slate-800/80 flex items-center gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-mono text-slate-200 hover:text-white transition-all shadow-sm"
                    >
                      <GithubIcon className="w-4 h-4 text-cyan-400" />
                      <span>View Repository</span>
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-mono text-cyan-200 transition-all shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                      <span>Live Website</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
