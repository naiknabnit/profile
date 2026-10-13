import React, { useState } from 'react';
import { Layers, Terminal, Sparkles, Server, Cpu, Database, Wrench } from 'lucide-react';

export const TechStackSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'frontend' | 'backend' | 'cloud'>('all');

  const categories = [
    { id: 'all', label: 'All Technologies' },
    { id: 'ai', label: 'AI & Reasoning' },
    { id: 'frontend', label: 'Frontend & Creative' },
    { id: 'backend', label: 'Backend & Data' },
    { id: 'cloud', label: 'Cloud & Infrastructure' },
  ];

  const skills = [
    // AI
    { name: 'LLMs', category: 'ai', level: 'Advanced', icon: '🤖', desc: 'Fine-tuning, prompt engineering, structured outputs' },
    { name: 'RAG', category: 'ai', level: 'Advanced', icon: '🔍', desc: 'Vector indexing, semantic reranking, hybrid search' },
    { name: 'LangGraph', category: 'ai', level: 'Proficient', icon: '🕸️', desc: 'Stateful multi-agent workflows and graph-based execution' },
    { name: 'Python', category: 'ai', level: 'Advanced', icon: '🐍', desc: 'Scientific computing, data workflows, AI agent backends' },
    
    // Frontend
    { name: 'TypeScript', category: 'frontend', level: 'Advanced', icon: '🔷', desc: 'Type-safe enterprise architecture and contracts' },
    { name: 'React 19', category: 'frontend', level: 'Advanced', icon: '⚛️', desc: 'Server components, concurrent rendering, custom hooks' },
    { name: 'Next.js', category: 'frontend', level: 'Advanced', icon: '▲', desc: 'App router, SSR/SSG, middleware, edge caching' },
    { name: 'Tailwind CSS', category: 'frontend', level: 'Advanced', icon: '🎨', desc: 'Modern responsive systems and bespoke token themes' },
    { name: 'Three.js', category: 'frontend', level: 'Proficient', icon: '🌐', desc: '3D WebGL scenes, post-processing shaders, particles' },
    { name: 'GSAP', category: 'frontend', level: 'Proficient', icon: '⚡', desc: 'ScrollTrigger timeline choreography & micro-interactions' },

    // Backend & Data
    { name: 'Node.js', category: 'backend', level: 'Advanced', icon: '🟢', desc: 'Scalable runtime, event loop, asynchronous IO' },
    { name: 'Prisma ORM', category: 'backend', level: 'Advanced', icon: '💎', desc: 'Declarative schemas, type-safe migrations & queries' },
    { name: 'SQLite', category: 'backend', level: 'Advanced', icon: '💾', desc: 'Embedded storage, high-speed atomic transactions' },
    { name: 'MongoDB', category: 'backend', level: 'Proficient', icon: '🍃', desc: 'Document schemas, aggregation pipelines' },
    { name: 'Java', category: 'backend', level: 'Proficient', icon: '☕', desc: 'Object-oriented programming, data structures, algorithms' },
    { name: 'C++', category: 'backend', level: 'Proficient', icon: '⚙️', desc: 'Performance-critical systems and algorithmic problem solving' },

    // Cloud & DevOps
    { name: 'Docker', category: 'cloud', level: 'Proficient', icon: '🐳', desc: 'Multi-stage builds, container isolation, compose orchestration' },
    { name: 'Kubernetes', category: 'cloud', level: 'Learning/Practicing', icon: '☸️', desc: 'Pods, services, ingress, and cluster orchestration' },
    { name: 'AWS Cloud', category: 'cloud', level: 'Proficient', icon: '☁️', desc: 'S3, EC2, Lambda serverless, and cloud delivery' },
    { name: 'Git & GitHub', category: 'cloud', level: 'Advanced', icon: '🐙', desc: 'Version control, branch workflows, collaborative PRs' },
  ];

  const filteredSkills =
    activeTab === 'all' ? skills : skills.filter((s) => s.category === activeTab);

  return (
    <section id="stack" className="relative py-28 px-6 max-w-7xl mx-auto z-10">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-950/40 text-xs font-mono text-teal-300 tracking-widest uppercase mb-4">
          <Layers className="w-3.5 h-3.5" />
          <span>03 // ARSENAL & TOOLKIT</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
          Technical Stack & Technologies
        </h2>
        <p className="mt-4 text-slate-400 max-w-2xl text-base md:text-lg font-light leading-relaxed">
          Technologies and tools calibrated for building modern AI applications, robust cloud backends, and responsive web products.
        </p>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mt-8 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as any)}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Technologies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSkills.map((skill, index) => (
          <div
            key={index}
            className="group p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(6,182,212,0.12)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{skill.icon}</span>
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

      {/* Skills Banner from Skillicons */}
      <div className="mt-12 p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md flex flex-col items-center text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">
          Core Languages & Ecosystem Icons
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
    </section>
  );
};
