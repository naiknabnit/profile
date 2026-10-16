// HorizonHeroSection.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ChevronDown, Sparkles, HeartHandshake } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export interface HorizonHeroProps {
  onScrollToContent?: () => void;
  onOpenWelcomeNote?: () => void;
}

export const Component: React.FC<HorizonHeroProps> = ({ 
  onScrollToContent,
  onOpenWelcomeNote 
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollProgressRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const smoothCameraPos = useRef({ x: 0, y: 16, z: 320 });
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isJapanese, setIsJapanese] = useState(false);
  
  // Timely transition of NABNIT to extracted Japanese letters ナブニット
  useEffect(() => {
    const interval = setInterval(() => {
      setIsJapanese((prev) => !prev);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const threeRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    composer: EffectComposer | null;
    stars: THREE.Points[];
    nebula: THREE.Mesh | null;
    mountains: THREE.Mesh[];
    animationId: number | null;
    targetCameraX?: number;
    targetCameraY?: number;
    targetCameraZ?: number;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null,
  });

  // Initialize Three.js scene
  useEffect(() => {
    const initThree = () => {
      const { current: refs } = threeRefs;
      if (!canvasRef.current) return;
      
      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025);

      refs.camera = new THREE.PerspectiveCamera(
        68,
        window.innerWidth / window.innerHeight,
        0.1,
        2500
      );
      refs.camera.position.set(0, 16, 320);

      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 0.5;

      refs.composer = new EffectComposer(refs.renderer);
      const renderPass = new RenderPass(refs.scene, refs.camera);
      refs.composer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.45,
        0.3,
        0.88
      );
      refs.composer.addPass(bloomPass);

      createStarField();
      createNebula();
      createMountains();
      createAtmosphere();

      animate();
      setIsReady(true);
    };

    const createStarField = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      const starCount = 5000;
      
      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          const radius = 260 + Math.random() * 850;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          const color = new THREE.Color();
          const colorChoice = Math.random();
          if (colorChoice < 0.7) {
            color.setHSL(0.55, 0.4, 0.9);
          } else if (colorChoice < 0.9) {
            color.setHSL(0.72, 0.5, 0.9);
          } else {
            color.setHSL(0.08, 0.6, 0.95);
          }
          
          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;

          sizes[j] = Math.random() * 2.2 + 0.6;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i },
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              float angle = time * 0.012 * (1.0 - depth * 0.25);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      const geometry = new THREE.PlaneGeometry(6000, 3200, 80, 80);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x0284c7) },
          color2: { value: new THREE.Color(0x4f46e5) },
          opacity: { value: 0.25 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 18.0;
            pos.z += elevation;
            vElevation = elevation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixFactor = sin(vUv.x * 8.0 + time * 0.18) * cos(vUv.y * 8.0 + time * 0.18);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 1.9);
            alpha *= 1.0 + vElevation * 0.01;
            gl_FragColor = vec4(color, max(0.0, alpha));
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.set(0, 60, -900);
      refs.scene.add(nebula);
      refs.nebula = nebula;
    };

    const createMountains = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      const layers = [
        { distance: -60, height: 40, color: 0x070b14, opacity: 1, baseOffsetY: -75 },
        { distance: -110, height: 55, color: 0x0c1427, opacity: 0.85, baseOffsetY: -85 },
        { distance: -160, height: 70, color: 0x111c38, opacity: 0.7, baseOffsetY: -95 },
        { distance: -220, height: 85, color: 0x082f49, opacity: 0.5, baseOffsetY: -105 },
      ];

      layers.forEach((layer) => {
        const points = [];
        const segments = 60;
        
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1200;
          const y = Math.sin(i * 0.12) * layer.height + 
                   Math.sin(i * 0.06) * layer.height * 0.35 +
                   Math.random() * layer.height * 0.12;
          points.push(new THREE.Vector2(x, y));
        }
        
        points.push(new THREE.Vector2(5000, -350));
        points.push(new THREE.Vector2(-5000, -350));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide,
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.set(0, layer.baseOffsetY, layer.distance);
        mountain.userData = { 
          baseZ: layer.distance, 
          baseY: layer.baseOffsetY,
        };
        refs.scene?.add(mountain);
        refs.mountains.push(mountain);
      });
    };

    const createAtmosphere = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      const geometry = new THREE.SphereGeometry(750, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          void main() {
            float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
            vec3 atmosphere = vec3(0.02, 0.5, 0.8) * intensity;
            gl_FragColor = vec4(atmosphere, intensity * 0.18);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });

      const atmosphere = new THREE.Mesh(geometry, material);
      refs.scene.add(atmosphere);
    };

    const animate = () => {
      const { current: refs } = threeRefs;
      refs.animationId = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;

      refs.stars.forEach((starField) => {
        const mat = starField.material as THREE.ShaderMaterial;
        if (mat.uniforms && mat.uniforms.time) {
          mat.uniforms.time.value = time;
        }
      });

      if (refs.nebula) {
        const mat = refs.nebula.material as THREE.ShaderMaterial;
        if (mat.uniforms && mat.uniforms.time) {
          mat.uniforms.time.value = time * 0.18;
        }
      }

      if (refs.camera && refs.targetCameraX !== undefined) {
        const smoothingFactor = 0.05;
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += ((refs.targetCameraY ?? 16) - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += ((refs.targetCameraZ ?? 320) - smoothCameraPos.current.z) * smoothingFactor;
        
        const floatX = Math.sin(time * 0.028) * 1.2;
        const floatY = Math.cos(time * 0.04) * 0.6;
        
        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, -10, -600);
      }

      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.4;
        mountain.position.x = Math.sin(time * 0.03) * 1.5 * parallaxFactor;
        const baseY = mountain.userData.baseY ?? -75;
        mountain.position.y = baseY + (Math.cos(time * 0.04) * 0.8 * parallaxFactor);
      });

      if (refs.composer) {
        refs.composer.render();
      }
    };

    initThree();

    const handleResize = () => {
      const { current: refs } = threeRefs;
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      const { current: refs } = threeRefs;
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener('resize', handleResize);

      refs.stars.forEach((s) => {
        s.geometry.dispose();
        if (Array.isArray(s.material)) s.material.forEach((m) => m.dispose());
        else s.material.dispose();
      });

      refs.mountains.forEach((m) => {
        m.geometry.dispose();
        if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
        else m.material.dispose();
      });

      if (refs.nebula) {
        refs.nebula.geometry.dispose();
        if (Array.isArray(refs.nebula.material)) refs.nebula.material.forEach((mat) => mat.dispose());
        else refs.nebula.material.dispose();
      }

      refs.renderer?.dispose();
    };
  }, []);

  // GSAP initial fade-ins
  useEffect(() => {
    if (!isReady) return;
    
    gsap.set([menuRef.current, scrollProgressRef.current], {
      visibility: 'visible',
    });

    const tl = gsap.timeline();
    if (menuRef.current) {
      tl.from(menuRef.current, {
        x: -80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });
    }

    if (scrollProgressRef.current) {
      tl.from(
        scrollProgressRef.current,
        {
          opacity: 0,
          y: 40,
          duration: 1.2,
          ease: 'power2.out',
        },
        '-=0.6'
      );
    }

    return () => {
      tl.kill();
    };
  }, [isReady]);

  // Smooth scroll flight: Page 1 (Name) -> Page 2 (Quote)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (!containerRef.current) return;
      const containerHeight = containerRef.current.offsetHeight;
      const maxScrollHero = Math.max(containerHeight - windowHeight, 1);
      const rawProgress = Math.min(scrollY / maxScrollHero, 1);
      
      setScrollProgress(rawProgress);

      const { current: refs } = threeRefs;
      
      // Camera smooth glide in safe range
      refs.targetCameraX = 0;
      refs.targetCameraY = 16 + rawProgress * 12;
      refs.targetCameraZ = 320 - rawProgress * 135; // safe range 320 -> 185

      refs.mountains.forEach((mountain, i) => {
        const speed = 1 + i * 0.6;
        mountain.position.z = mountain.userData.baseZ + scrollY * speed * 0.25;
      });

      if (refs.nebula) {
        refs.nebula.position.z = -900 + scrollY * 0.1;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPhase2 = () => {
    if (!containerRef.current) return;
    const windowHeight = window.innerHeight;
    const targetY = (containerRef.current.offsetHeight - windowHeight) * 0.55;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const isPage2Active = scrollProgress >= 0.45;

  return (
    <div ref={containerRef} className="hero-container cosmos-style relative w-full">
      <canvas ref={canvasRef} className="hero-canvas" />
      
      {/* Side menu badge */}
      <div ref={menuRef} className="side-menu" style={{ visibility: 'hidden' }}>
        <div className="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="vertical-text">NABNIT</div>
      </div>

      {/* FIXED VIEWPORT FRAME CONTAINING PAGE 1 & PAGE 2 */}
      <div 
        className={`hero-sticky-frame transition-opacity duration-[1500ms] ${
          scrollProgress > 0.95 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* ========================================================
            PAGE 1: ANIMATED WELCOME NOTE & NAME (NABNIT ⇄ ナブニット)
            Active when scrollProgress < 0.45
            ======================================================== */}
        <div
          className={`transition-all duration-[1500ms] flex flex-col items-center justify-center text-center w-full max-w-5xl px-4 absolute ${
            !isPage2Active
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-12 pointer-events-none'
          }`}
        >
          {/* ANIMATED WELCOME NOTE BADGE WITH NABNIT'S NAME */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full border border-cyan-400/60 bg-cyan-950/80 backdrop-blur-md text-xs font-mono text-cyan-300 tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.45)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span className="font-bold">WELCOME TO THE DIGITAL UNIVERSE OF NABNIT NAIK</span>
            <span className="ml-2 pl-2 border-l border-cyan-500/40 text-[10px] text-cyan-400/90 font-semibold hidden sm:inline">
              {isJapanese ? 'JP // ナブニット' : 'EN // NABNIT'}
            </span>
          </div>

          {/* DYNAMIC TITLE: Ultra-visible, single-line guaranteed */}
          <div className="relative min-h-[140px] md:min-h-[180px] flex items-center justify-center w-full my-2 overflow-visible">
            {/* English Typography - High Luminance */}
            <h1
              className={`hero-title transition-all duration-[1500ms] absolute font-black tracking-[0.22em] text-center w-full whitespace-nowrap select-none ${
                !isJapanese
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
              }`}
            >
              NABNIT
            </h1>

            {/* Extracted Japanese Typography - Strictly single line */}
            <h1
              lang="ja"
              style={{ fontFamily: "'Noto Sans JP', 'Plus Jakarta Sans', sans-serif" }}
              className={`hero-title transition-all duration-[1500ms] absolute font-black tracking-[0.1em] md:tracking-[0.16em] text-center w-full whitespace-nowrap select-none ${
                isJapanese
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
              }`}
            >
              ナブニット
            </h1>
          </div>

          {/* PERSONALIZED WELCOME NOTE SUBTITLE */}
          <div className="mt-4 flex flex-col items-center gap-2 max-w-2xl">
            <p className="text-base md:text-xl text-slate-100 font-medium tracking-wide">
              Hello and welcome! I'm <span className="text-cyan-300 font-bold">Nabnit Naik</span> — Computer Science Engineer & Developer.
            </p>
            <p className="text-xs md:text-sm text-slate-400 font-light leading-relaxed">
              Step inside to explore my universe of intelligent software, agentic workflows, and full-stack digital creations.
            </p>
            <div className="inline-flex items-center gap-2.5 text-xs font-mono text-cyan-400/90 tracking-widest mt-1">
              <span>AI</span>
              <span className="text-slate-600">//</span>
              <span>FULL STACK</span>
              <span className="text-slate-600">//</span>
              <span>CLOUD</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {onOpenWelcomeNote && (
              <button
                onClick={onOpenWelcomeNote}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-cyan-400/60 bg-cyan-950/70 hover:bg-cyan-900/80 text-xs font-mono text-cyan-300 transition-all backdrop-blur-md cursor-pointer hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Read Full Welcome Note</span>
              </button>
            )}

            <button
              onClick={() => setIsJapanese(!isJapanese)}
              className="px-4 py-2 rounded-full border border-slate-700 bg-slate-900/80 hover:border-cyan-500/50 text-xs font-mono text-slate-300 hover:text-white transition-all backdrop-blur-md cursor-pointer"
              title="Toggle English / Japanese"
            >
              Switch {isJapanese ? 'English (NABNIT)' : 'Japanese (ナブニット)'}
            </button>

            <button
              onClick={scrollToPhase2}
              className="px-5 py-2 rounded-full border border-cyan-400/40 bg-cyan-500/15 hover:bg-cyan-500/30 text-xs font-mono text-cyan-200 transition-all backdrop-blur-md cursor-pointer hover:shadow-[0_0_20px_rgba(6,182,212,0.35)]"
            >
              Scroll to Motto ↓
            </button>
          </div>
        </div>

        {/* ========================================================
            PAGE 2: THE QUOTE DISPLAY ("Curious by nature. Builder by choice.")
            Active when scrollProgress >= 0.45
            ======================================================== */}
        <div
          className={`transition-all duration-[1500ms] flex flex-col items-center justify-center text-center w-full max-w-4xl px-4 absolute ${
            isPage2Active
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 translate-y-12 pointer-events-none'
          }`}
        >
          {/* Quote Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-6 rounded-full border border-indigo-400/50 bg-indigo-950/60 backdrop-blur-md text-xs font-mono text-indigo-300 tracking-wider shadow-[0_0_25px_rgba(99,102,241,0.35)]">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>CORE PHILOSOPHY // MISSION</span>
          </div>

          {/* The Iconic Quote */}
          <blockquote className="quote-display my-2">
            "Curious by nature. Builder by choice."
          </blockquote>

          {/* Subtitle */}
          <div className="mt-5 flex flex-col items-center gap-1.5 max-w-2xl">
            <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed">
              Engineering intelligent multi-agent architectures, scalable web systems, and practical digital products.
            </p>
            <span className="text-xs font-mono text-cyan-400/80 tracking-widest mt-2 uppercase">
              NABNIT NAIK // CRAFTING THE FUTURE
            </span>
          </div>

          {/* Action CTA */}
          <div className="mt-8 flex items-center justify-center gap-4">
            {onScrollToContent && (
              <button 
                onClick={onScrollToContent}
                className="px-7 py-3 rounded-full border border-cyan-400/60 bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-100 text-sm font-mono tracking-wide transition-all duration-300 backdrop-blur-md cursor-pointer hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:scale-105"
              >
                Explore Portfolio & Repositories ↓
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          21st.dev STYLE INTERACTIVE SCROLL ANIMATION INDICATOR
          ======================================================== */}
      <div 
        onClick={isPage2Active ? onScrollToContent : scrollToPhase2}
        className="fixed bottom-7 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 cursor-pointer group select-none"
        title={isPage2Active ? "Scroll to Portfolio" : "Scroll to Motto"}
      >
        {/* Animated Mouse Capsule */}
        <div className="w-6 h-10 rounded-full border-2 border-cyan-400/60 bg-slate-950/70 backdrop-blur-md flex items-start justify-center p-1.5 shadow-[0_0_20px_rgba(6,182,212,0.35)] group-hover:border-cyan-300 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all">
          <div className="w-1.5 h-2.5 rounded-full bg-cyan-400 animate-scroll-pill shadow-[0_0_8px_#38bdf8]" />
        </div>

        {/* Bouncing Chevron & Cue */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-300/80 group-hover:text-cyan-200 tracking-wider">
          <span>{isPage2Active ? 'EXPLORE PORTFOLIO' : 'PHASE 01 / 02'}</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce text-cyan-400" />
        </div>
      </div>

      {/* Virtual Scroll Height Track for 2-page glide */}
      <div className="scroll-sections-track">
        <div className="content-section-virtual" />
        <div className="content-section-virtual" />
      </div>
    </div>
  );
};

export default Component;
