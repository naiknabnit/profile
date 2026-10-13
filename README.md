# Nabnit Naik - Portfolio & 3D Horizon Experience

A modern developer portfolio and interactive 3D WebGL experience integrated with real-time GitHub activity for **Nabnit Naik** ([@naiknabnit](https://github.com/naiknabnit)).

Built with **React 19**, **Three.js**, **GSAP**, **Tailwind CSS v4**, and **TypeScript** adhering to the shadcn architectural structure.

---

## ✨ Features

- **🌌 3D Horizon Hero Section**:
  - Procedural WebGL starfields with depth-based rotation
  - Volumetric mathematical nebula shaders with glowing bloom post-processing (`UnrealBloomPass`)
  - Multi-layered procedural mountains with real-time parallax scrolling
  - Smooth camera interpolation and floating cinematic physics
  - Split-text reveal choreographies powered by GSAP & ScrollTrigger
- **👤 Authentic GitHub Profile Integration**:
  - Live data synchronization with `api.github.com/users/naiknabnit`
  - Dynamic repositories feed displaying active repos, star counts, and language tags
  - Interactive GitHub analytics widgets (Streak stats, top language breakdown, overview cards)
- **🚀 Featured Projects Showcase**:
  - **Agentic AI Workflows**: Autonomous RAG pipelines, LangGraph, and multi-agent systems
  - **CarCareAI**: Automotive intelligent diagnostic and telemetry platform
  - **Union Church Bhubaneswar**: Live production Next.js & Prisma web system ([unionchurch.in](https://www.unionchurch.in/))
  - **website.v**: Experimental web playground
- **⚡ Tech Stack Matrix**:
  - Interactive skill taxonomy with filter tabs (AI, Frontend, Backend, Cloud & DevOps)
- **📱 Fully Responsive & Polished**:
  - Floating cosmic navigation bar with quick jump links
  - High-performance 60fps animations
  - Glassmorphic cybernetic theme with custom cyan & indigo accents

---

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript, Vite
- **3D & Animation**: Three.js, GSAP (ScrollTrigger), Post-processing (`EffectComposer`, `RenderPass`, `UnrealBloomPass`)
- **Styling**: Tailwind CSS v4, Vanilla CSS Design System
- **Icons**: Lucide React & Custom SVG brand components
- **Architecture**: shadcn-compatible structure with `@/*` aliases and `/components/ui` primitives

---

## 📁 Project Structure

```
├── public/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── horizon-hero-section.tsx   # 3D Three.js + GSAP Hero Section
│   │   ├── AboutSection.tsx               # Biography, pillars & GitHub JSON inspector
│   │   ├── ContactFooter.tsx              # Quick contact actions & footer
│   │   ├── GitHubStatsSection.tsx         # Live GitHub repos & metrics
│   │   ├── Navbar.tsx                     # Top floating navigation header
│   │   ├── ProjectsSection.tsx            # Selected engineering projects
│   │   ├── TechStackSection.tsx           # Categorized technology matrix
│   │   └── icons.tsx                      # Brand SVG components
│   ├── lib/
│   │   └── utils.ts                       # Class merging utility (clsx + tailwind-merge)
│   ├── App.tsx                            # Root application composition
│   ├── demo.tsx                           # Standalone Hero Section demo export
│   ├── index.css                          # Cosmic design tokens & Tailwind imports
│   └── main.tsx                           # Application entry point
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/naiknabnit/profile.git
   cd profile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📬 Contact & Socials

- **GitHub**: [@naiknabnit](https://github.com/naiknabnit)
- **LinkedIn**: [Nabnit Naik](https://www.linkedin.com/in/nabnitnaik/)
- **Live Project**: [Union Church Bhubaneswar](https://www.unionchurch.in/)
- **Email**: `nabnitnaik@gmail.com`

---

*Designed with intent • Built with curiosity • Powered by code.*
