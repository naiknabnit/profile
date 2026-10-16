import React, { useState, useEffect } from 'react';
import { Component as HorizonHeroSection } from '@/components/ui/horizon-hero-section';
import { Navbar } from '@/components/Navbar';
import { WelcomeOverlay } from '@/components/WelcomeOverlay';
import { AboutSection } from '@/components/AboutSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { TechStackSection } from '@/components/TechStackSection';
import { GitHubStatsSection } from '@/components/GitHubStatsSection';
import { ContactFooter } from '@/components/ContactFooter';

interface GitHubUserData {
  login: string;
  name: string;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export function App() {
  const [welcomeOpen, setWelcomeOpen] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('nabnit_welcome_seen');
    } catch {
      return true;
    }
  });

  const [githubUser, setGithubUser] = useState<GitHubUserData>({
    login: 'naiknabnit',
    name: 'Nabnit Naik',
    avatar_url: 'https://avatars.githubusercontent.com/u/175724208?v=4',
    bio: 'Computer Science Engineering • Developer • Problem Solver',
    company: 'iter',
    public_repos: 4,
    followers: 1,
    following: 1,
    created_at: '2024-07-16T14:52:58Z',
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const res = await fetch('https://api.github.com/users/naiknabnit');
        if (res.ok) {
          const data = await res.json();
          setGithubUser({
            login: data.login || 'naiknabnit',
            name: data.name || 'Nabnit Naik',
            avatar_url: data.avatar_url || 'https://avatars.githubusercontent.com/u/175724208?v=4',
            bio: data.bio || 'Computer Science Engineering • Developer • Problem Solver',
            company: data.company || 'iter',
            public_repos: data.public_repos ?? 4,
            followers: data.followers ?? 1,
            following: data.following ?? 1,
            created_at: data.created_at || '2024-07-16T14:52:58Z',
          });
        }
      } catch (err) {
        console.warn('GitHub user fetch fallback used', err);
      }
    };
    loadUserData();
  }, []);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToContent = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 2.8, behavior: 'smooth' });
    }
  };

  const handleEnterUniverse = () => {
    try {
      sessionStorage.setItem('nabnit_welcome_seen', 'true');
    } catch {
      // ignore
    }
    setWelcomeOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Cinematic Welcome Transmission Overlay */}
      <WelcomeOverlay
        isOpen={welcomeOpen}
        onEnter={handleEnterUniverse}
        onClose={() => setWelcomeOpen(false)}
      />

      {/* Top Floating Navbar */}
      <Navbar 
        onNavigate={handleNavigate} 
        onOpenWelcome={() => setWelcomeOpen(true)}
      />

      {/* 3D Horizon Hero Section */}
      <div id="hero" className="relative">
        <HorizonHeroSection 
          onScrollToContent={handleScrollToContent} 
          onOpenWelcomeNote={() => setWelcomeOpen(true)}
        />
      </div>

      {/* Content Container positioned seamlessly beneath 3D flight */}
      <main className="relative z-20 bg-slate-950/95 backdrop-blur-2xl border-t border-cyan-500/20 shadow-[0_-30px_100px_rgba(0,0,0,0.95)]">
        {/* Glow Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        {/* Section 01: About & Persona */}
        <AboutSection githubUser={githubUser} />

        {/* Section 02: Featured Projects */}
        <ProjectsSection />

        {/* Section 03: Tech Stack Matrix with Bubble Animations */}
        <TechStackSection />

        {/* Section 04: GitHub Live Repos & Analytics */}
        <GitHubStatsSection />

        {/* Section 05: Contact & Footer */}
        <ContactFooter />
      </main>
    </div>
  );
}

export default App;
