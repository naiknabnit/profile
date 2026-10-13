import React, { useState, useEffect } from 'react';
import { Star, GitFork, BookOpen, ExternalLink, RefreshCw, Activity, GitBranch, Copy, Check, Terminal, Filter } from 'lucide-react';
import { GithubIcon } from './icons';
import { ScrollReveal } from './ScrollReveal';

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

export const GitHubStatsSection: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([
    {
      name: 'CarCareAI',
      description: 'Automotive-focused intelligent web application exploring AI-driven diagnostics and maintenance telemetry.',
      language: 'JavaScript',
      html_url: 'https://github.com/naiknabnit/CarCareAI',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-03-01T00:00:00Z',
    },
    {
      name: 'cocuc-web',
      description: 'Next.js & Prisma web application for the Union Church Bhubaneswar platform and digital portals.',
      language: 'TypeScript',
      html_url: 'https://github.com/naiknabnit/cocuc-web',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-02-28T00:00:00Z',
    },
    {
      name: 'website.v',
      description: 'Personal web experimental platform and interactive component sandbox.',
      language: 'JavaScript',
      html_url: 'https://github.com/naiknabnit/website.v',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-02-16T12:17:26Z',
    },
    {
      name: 'naiknabnit',
      description: 'Curated developer profile configuration repository and technical roadmap.',
      language: 'Markdown',
      html_url: 'https://github.com/naiknabnit/naiknabnit',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-02-14T00:00:00Z',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [copiedRepo, setCopiedRepo] = useState<string | null>(null);

  const fetchLiveRepos = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.github.com/users/naiknabnit/repos?sort=updated');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setRepos(data);
        }
      }
    } catch (e) {
      console.warn('Using cached repositories due to rate limits or network', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveRepos();
  }, []);

  const copyCloneCommand = (repoUrl: string, repoName: string) => {
    navigator.clipboard.writeText(`git clone ${repoUrl}.git`);
    setCopiedRepo(repoName);
    setTimeout(() => setCopiedRepo(null), 2200);
  };

  const getLanguageColor = (lang: string | null) => {
    switch (lang?.toLowerCase()) {
      case 'javascript':
        return 'bg-amber-400 border-amber-400/40 text-amber-300';
      case 'typescript':
        return 'bg-blue-400 border-blue-400/40 text-blue-300';
      case 'python':
        return 'bg-emerald-400 border-emerald-400/40 text-emerald-300';
      case 'java':
        return 'bg-orange-500 border-orange-500/40 text-orange-300';
      case 'c++':
        return 'bg-pink-400 border-pink-400/40 text-pink-300';
      default:
        return 'bg-cyan-400 border-cyan-400/40 text-cyan-300';
    }
  };

  const languages = ['all', ...Array.from(new Set(repos.map((r) => r.language).filter(Boolean)))];

  const filteredRepos =
    selectedLanguage === 'all'
      ? repos
      : repos.filter((r) => r.language?.toLowerCase() === selectedLanguage?.toLowerCase());

  return (
    <section id="repos" className="relative py-28 px-6 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <ScrollReveal direction="up">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-xs font-mono text-cyan-300 tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Activity className="w-3.5 h-3.5" />
              <span>04 // GIT REPOSITORIES & REVISION CONTROL</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Live Git Engine & Repositories
            </h2>
            <p className="mt-3 text-slate-400 max-w-xl text-sm md:text-base font-light">
              Direct connection to <code className="text-cyan-300 font-mono">github.com/naiknabnit</code> with interactive clone actions and live telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchLiveRepos}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm disabled:opacity-50 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Synchronizing...' : 'Sync Git API'}</span>
            </button>
          </div>
        </div>

        {/* Animated Git Branch Timeline Visualization */}
        <div className="mb-10 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden relative">
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent top-0" />
          
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
              <GitBranch className="w-3.5 h-3.5" />
              <span>main branch</span>
            </span>
            <div className="hidden sm:flex items-center gap-2 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>origin/main synced</span>
            </div>
          </div>

          {/* Language filter pills */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang || 'all')}
                className={`px-3 py-1 rounded-lg transition-all capitalize cursor-pointer ${
                  selectedLanguage === lang
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Repositories Cards Grid with Staggered ScrollReveal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {filteredRepos.map((repo, idx) => (
          <ScrollReveal key={repo.name} direction="up" delay={idx * 100}>
            <div className="group relative p-7 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(6,182,212,0.18)] flex flex-col justify-between overflow-hidden">
              {/* Animated top border beam */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-400 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div>
                {/* Repo Header */}
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/40 transition-colors">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-mono tracking-tight flex items-center gap-1.5"
                      >
                        {repo.name}
                      </a>
                      <span className="text-[11px] font-mono text-slate-400">naiknabnit / public</span>
                    </div>
                  </div>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Open on GitHub"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Repo Description */}
                <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed mb-6">
                  {repo.description || 'Repository dedicated to research and software implementation.'}
                </p>
              </div>

              {/* Bottom Actions & Stats */}
              <div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.language).split(' ')[0]}`} />
                    <span className="font-medium text-slate-300">{repo.language || 'Codebase'}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 hover:text-amber-300 transition-colors">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>{repo.stargazers_count}</span>
                    </span>
                    <span className="flex items-center gap-1 hover:text-cyan-300 transition-colors">
                      <GitFork className="w-3.5 h-3.5 text-slate-400" />
                      <span>{repo.forks_count}</span>
                    </span>
                  </div>
                </div>

                {/* 1-Click Clone Command Action */}
                <div className="mt-4 pt-3 flex items-center justify-between">
                  <button
                    onClick={() => copyCloneCommand(repo.html_url, repo.name)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                  >
                    {copiedRepo === repo.name ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">git clone command copied!</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Copy git clone command</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* GitHub Analytics Widgets Cards with ScrollReveal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ScrollReveal direction="left" delay={200}>
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/30 backdrop-blur-xl flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_10px_35px_rgba(6,182,212,0.15)]">
            <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <GithubIcon className="w-4 h-4 text-cyan-400" />
              GitHub Activity Metrics
            </h3>
            <div className="w-full flex justify-center overflow-hidden rounded-xl">
              <img
                src="https://github-readme-stats.vercel.app/api?username=naiknabnit&show_icons=true&hide_border=true&bg_color=0D1117&title_color=A78BFA&icon_color=67E8F9&text_color=C9D1D9&rank_icon=github"
                alt="Nabnit Naik GitHub Stats"
                className="max-w-full h-auto rounded-xl hover:scale-102 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={200}>
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 hover:border-indigo-500/30 backdrop-blur-xl flex flex-col items-center text-center justify-between gap-6 transition-all duration-300 hover:shadow-[0_10px_35px_rgba(99,102,241,0.15)]">
            <div className="w-full">
              <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-6 flex items-center justify-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                Language Analytics
              </h3>
              <div className="w-full flex justify-center overflow-hidden rounded-xl">
                <img
                  src="https://github-readme-stats.vercel.app/api/top-langs/?username=naiknabnit&layout=compact&hide_border=true&bg_color=0D1117&title_color=A78BFA&text_color=C9D1D9&langs_count=6"
                  alt="Nabnit Naik Top Languages"
                  className="max-w-full h-auto rounded-xl hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="w-full pt-4 border-t border-slate-800/80">
              <img
                src="https://streak-stats.demolab.com?user=naiknabnit&theme=transparent&hide_border=true&ring=A78BFA&fire=67E8F9&currStreakLabel=A78BFA&sideLabels=9CA3AF&dates=6B7280"
                alt="Nabnit Naik Streak Stats"
                className="max-w-full h-auto mx-auto"
                loading="lazy"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
