import React, { useState, useEffect } from 'react';
import { Star, GitFork, BookOpen, ExternalLink, RefreshCw, Activity } from 'lucide-react';
import { GithubIcon } from './icons';

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

  const getLanguageColor = (lang: string | null) => {
    switch (lang?.toLowerCase()) {
      case 'javascript':
        return 'bg-amber-400';
      case 'typescript':
        return 'bg-blue-400';
      case 'python':
        return 'bg-emerald-400';
      case 'java':
        return 'bg-orange-500';
      case 'c++':
        return 'bg-pink-400';
      default:
        return 'bg-cyan-400';
    }
  };

  return (
    <section id="repos" className="relative py-28 px-6 max-w-7xl mx-auto z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-xs font-mono text-cyan-300 tracking-widest uppercase mb-4">
            <Activity className="w-3.5 h-3.5" />
            <span>04 // GITHUB REPOSITORIES & ANALYTICS</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Live Git Activity & Repos
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl text-sm md:text-base font-light">
            Real-time feed directly synchronized with <code className="text-cyan-300">github.com/naiknabnit</code>.
          </p>
        </div>

        <button
          onClick={fetchLiveRepos}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Synchronizing...' : 'Refresh API Repos'}</span>
        </button>
      </div>

      {/* Repositories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {repos.map((repo) => (
          <div
            key={repo.name}
            className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(6,182,212,0.12)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-white hover:text-cyan-300 transition-colors font-mono tracking-tight"
                  >
                    naiknabnit / {repo.name}
                  </a>
                </div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Open on GitHub"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed mb-6">
                {repo.description || 'Repository dedicated to research and software implementation.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.language)}`} />
                <span>{repo.language || 'Codebase'}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 hover:text-cyan-300 transition-colors">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span>{repo.stargazers_count}</span>
                </span>
                <span className="flex items-center gap-1 hover:text-cyan-300 transition-colors">
                  <GitFork className="w-3.5 h-3.5 text-slate-400" />
                  <span>{repo.forks_count}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GitHub Analytics Widgets Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Readme Stats Card */}
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl flex flex-col items-center text-center">
          <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <GithubIcon className="w-4 h-4 text-cyan-400" />
            GitHub Overview Metrics
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

        {/* Top Languages & Streak Card */}
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl flex flex-col items-center text-center justify-between gap-6">
          <div className="w-full">
            <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-6 flex items-center justify-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Most Frequent Languages
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
      </div>
    </section>
  );
};
