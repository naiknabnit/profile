// HorizonHeroSection.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

gsap.registerPlugin(ScrollTrigger);

export interface HorizonHeroProps {
  onScrollToContent?: () => void;
}

export const Component: React.FC<HorizonHeroProps> = ({ onScrollToContent }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollProgressRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const smoothCameraPos = useRef({ x: 0, y: 15, z: 320 });
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isJapaneseName, setIsJapaneseName] = useState(false);
  const totalSections = 2; // 3 phases: 0, 1, 2
  
  // Timely transition of name NABNIT to Japanese letters
  useEffect(() => {
    const interval = setInterval(() => {
      setIsJapaneseName((prev) => !prev);
    }, 3800);
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
    locations?: number[];
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
      
      // Scene setup
      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x000000, 0.0003);

      // Camera
      refs.camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        2200
      );
      refs.camera.position.z = 320;
      refs.camera.position.y = 15;

      // Renderer
      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 0.65;

      // Post-processing
      refs.composer = new EffectComposer(refs.renderer);
      const renderPass = new RenderPass(refs.scene, refs.camera);
      refs.composer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.75,
        0.35,
        0.82
      );
      refs.composer.addPass(bloomPass);

      // Create celestial scene elements
      createStarField();
      createNebula();
      createMountains();
      createAtmosphere();
      getLocation();

      // Start animation loop
      animate();
      setIsReady(true);
    };

    const createStarField = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      const starCount = 5500;
      
      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          const radius = 250 + Math.random() * 850;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          const color = new THREE.Color();
          const colorChoice = Math.random();
          if (colorChoice < 0.7) {
            color.setHSL(0.55, 0.4, 0.85); // soft cyan-blue
          } else if (colorChoice < 0.9) {
            color.setHSL(0.75, 0.5, 0.85); // indigo
          } else {
            color.setHSL(0.08, 0.6, 0.9); // golden starlight
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
              
              float angle = time * 0.04 * (1.0 - depth * 0.25);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (320.0 / -mvPosition.z);
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
      
      const geometry = new THREE.PlaneGeometry(8000, 4200, 100, 100);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x06b6d4) }, // cyan neon
          color2: { value: new THREE.Color(0x6366f1) }, // indigo
          opacity: { value: 0.35 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 22.0;
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
            float mixFactor = sin(vUv.x * 9.0 + time * 0.6) * cos(vUv.y * 9.0 + time * 0.6);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 1.8);
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
      nebula.position.z = -950;
      nebula.position.y = 80;
      refs.scene.add(nebula);
      refs.nebula = nebula;
    };

    const createMountains = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      // Position mountains at the lower horizon (y <= -60) so center text is never blocked!
      const layers = [
        { distance: -60, height: 45, color: 0x090d16, opacity: 1, baseOffsetY: -65 },
        { distance: -110, height: 60, color: 0x0f172a, opacity: 0.85, baseOffsetY: -75 },
        { distance: -160, height: 75, color: 0x1e1b4b, opacity: 0.7, baseOffsetY: -85 },
        { distance: -220, height: 90, color: 0x0c4a6e, opacity: 0.5, baseOffsetY: -95 },
      ];

      layers.forEach((layer, index) => {
        const points = [];
        const segments = 60;
        
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1200;
          const y = Math.sin(i * 0.12) * layer.height + 
                   Math.sin(i * 0.06) * layer.height * 0.4 +
                   Math.random() * layer.height * 0.15;
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
        mountain.position.z = layer.distance;
        mountain.position.y = layer.baseOffsetY;
        mountain.userData = { 
          baseZ: layer.distance, 
          baseY: layer.baseOffsetY,
          index 
        };
        refs.scene?.add(mountain);
        refs.mountains.push(mountain);
      });
    };

    const createAtmosphere = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      const geometry = new THREE.SphereGeometry(650, 32, 32);
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
            float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
            vec3 atmosphere = vec3(0.02, 0.7, 0.9) * intensity;
            float pulse = sin(time * 1.5) * 0.08 + 0.92;
            atmosphere *= pulse;
            gl_FragColor = vec4(atmosphere, intensity * 0.3);
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

      // Update stars rotation
      refs.stars.forEach((starField) => {
        const mat = starField.material as THREE.ShaderMaterial;
        if (mat.uniforms && mat.uniforms.time) {
          mat.uniforms.time.value = time;
        }
      });

      // Update nebula wave
      if (refs.nebula) {
        const mat = refs.nebula.material as THREE.ShaderMaterial;
        if (mat.uniforms && mat.uniforms.time) {
          mat.uniforms.time.value = time * 0.5;
        }
      }

      // Smooth camera interpolation
      if (refs.camera && refs.targetCameraX !== undefined) {
        const smoothingFactor = 0.045;
        
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += ((refs.targetCameraY ?? 15) - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += ((refs.targetCameraZ ?? 320) - smoothCameraPos.current.z) * smoothingFactor;
        
        const floatX = Math.sin(time * 0.08) * 1.5;
        const floatY = Math.cos(time * 0.12) * 0.8;
        
        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, -10, -600);
      }

      // Subtle parallax mountain breathing - always at bottom horizon
      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.4;
        mountain.position.x = Math.sin(time * 0.09) * 2 * parallaxFactor;
        const baseY = mountain.userData.baseY ?? -70;
        mountain.position.y = baseY + (Math.cos(time * 0.12) * 1 * parallaxFactor);
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

  const getLocation = () => {
    const { current: refs } = threeRefs;
    const locations: number[] = [];
    refs.mountains.forEach((mountain, i) => {
      locations[i] = mountain.position.z;
    });
    refs.locations = locations;
  };

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

  // Extended scroll handling through 3 distinct cinematic phases
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress within hero container
      if (!containerRef.current) return;
      const containerHeight = containerRef.current.offsetHeight;
      const maxScrollHero = Math.max(containerHeight - windowHeight, 1);
      const rawProgress = Math.min(scrollY / maxScrollHero, 1);
      
      setScrollProgress(rawProgress);

      // Section 0: 0.00 -> 0.33 (NABNIT)
      // Section 1: 0.33 -> 0.66 (AGENTIC AI)
      // Section 2: 0.66 -> 1.00 (FULL STACK)
      const mappedSection = rawProgress < 0.35 ? 0 : rawProgress < 0.70 ? 1 : 2;
      setCurrentSection(mappedSection);

      const { current: refs } = threeRefs;
      
      // Extended Camera positions for prolonged flight
      const cameraPositions = [
        { x: 0, y: 15, z: 320 },   // Phase 0: NABNIT (Wide stellar expanse)
        { x: 0, y: 28, z: 40 },    // Phase 1: AGENTIC AI (Flying through the glowing core)
        { x: 0, y: 40, z: -320 },  // Phase 2: FULL STACK & CLOUD (Ascending toward the horizon)
      ];

      const progressNormalized = rawProgress * 2; // [0 -> 2]
      const currentIdx = Math.min(Math.floor(progressNormalized), 1);
      const frac = progressNormalized - currentIdx;

      const p0 = cameraPositions[currentIdx];
      const p1 = cameraPositions[currentIdx + 1] || p0;

      refs.targetCameraX = p0.x + (p1.x - p0.x) * frac;
      refs.targetCameraY = p0.y + (p1.y - p0.y) * frac;
      refs.targetCameraZ = p0.z + (p1.z - p0.z) * frac;

      // Gentle mountain parallax
      refs.mountains.forEach((mountain, i) => {
        const speed = 1 + i * 0.7;
        const targetZ = mountain.userData.baseZ + scrollY * speed * 0.3;
        mountain.position.z = targetZ;
      });

      if (refs.nebula) {
        refs.nebula.position.z = -950 + scrollY * 0.15;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section Data aligned with Nabnit Naik's profile
  const profilePhases = [
    {
      badge: 'GITHUB PROFILE // NAIKNABNIT',
      titleEnglish: 'NABNIT',
      subtitleLine1: 'Computer Science Engineering • Developer • Problem Solver',
      subtitleLine2: 'Curious by nature. Builder by choice.',
    },
    {
      badge: 'CORE DOMAIN // INTELLIGENCE',
      titleEnglish: 'AGENTIC AI',
      subtitleLine1: 'LLMs, RAG & Autonomous Multi-Agent Workflows',
      subtitleLine2: 'Engineering reasoning engines, LangGraph architectures & vector retrieval',
    },
    {
      badge: 'CORE DOMAIN // ARCHITECTURE',
      titleEnglish: 'FULL STACK',
      subtitleLine1: 'Modern Web Engineering & Production Cloud Scale',
      subtitleLine2: 'Next.js • React • Containerized Microservices • Real-world impact',
    },
  ];

  const currentPhase = profilePhases[currentSection] || profilePhases[0];

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

      {/* FIXED VIEWPORT HERO OVERLAY - Always perfectly centered and legible! */}
      <div 
        className={`hero-sticky-frame transition-opacity duration-700 ${
          scrollProgress > 0.98 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
          {/* Phase Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-5 rounded-full border border-cyan-500/40 bg-cyan-950/50 backdrop-blur-md text-xs font-mono text-cyan-300 tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>{currentPhase.badge}</span>
            {currentSection === 0 && (
              <span className="ml-2 pl-2 border-l border-cyan-500/40 text-[10px] text-cyan-400/80">
                {isJapaneseName ? 'JP // ナブニット' : 'EN // NABNIT'}
              </span>
            )}
          </div>

          {/* DYNAMIC TITLE DISPLAY */}
          {currentSection === 0 ? (
            /* First Page: Timely Transition between NABNIT (EN) and Japanese Calligraphy */
            <div className="relative min-h-[140px] md:min-h-[180px] flex items-center justify-center w-full my-2">
              {/* English Name */}
              <h1
                className={`hero-title transition-all duration-700 absolute ${
                  !isJapaneseName
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
                }`}
              >
                NABNIT
              </h1>

              {/* Japanese Letters Calligraphy */}
              <div
                className={`transition-all duration-700 flex flex-col items-center justify-center absolute ${
                  isJapaneseName
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                }`}
              >
                <img
                  src="/nabnit-japanese.png"
                  alt="Nabnit in Japanese (ナブニット)"
                  className="japanese-calligraphy h-28 md:h-44 w-auto object-contain max-w-[85vw]"
                />
                <span className="text-xs font-mono tracking-[0.4em] text-cyan-300 uppercase mt-1 text-center">
                  ナブニット • NABNIT
                </span>
              </div>
            </div>
          ) : (
            /* Subsequent Phases: AGENTIC AI / FULL STACK */
            <div className="relative min-h-[140px] md:min-h-[180px] flex items-center justify-center w-full my-2">
              <h2 className="hero-title">
                {currentPhase.titleEnglish}
              </h2>
            </div>
          )}

          {/* Subtitle description */}
          <div className="hero-subtitle cosmos-subtitle transition-all duration-500 mt-3">
            <p className="subtitle-line font-medium text-slate-200">
              {currentPhase.subtitleLine1}
            </p>
            <p className="subtitle-line text-slate-400 text-sm md:text-base">
              {currentPhase.subtitleLine2}
            </p>
          </div>

          {/* Interactive CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {onScrollToContent && (
              <button 
                onClick={onScrollToContent}
                className="px-6 py-2.5 rounded-full border border-cyan-400/50 bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-200 text-sm font-mono tracking-wide transition-all duration-300 backdrop-blur-md cursor-pointer hover:shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:scale-105"
              >
                Explore Portfolio ↓
              </button>
            )}

            {currentSection === 0 && (
              <button
                onClick={() => setIsJapaneseName(!isJapaneseName)}
                className="px-4 py-2 rounded-full border border-slate-700 bg-slate-900/60 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all backdrop-blur-sm cursor-pointer"
                title="Switch English / Japanese Calligraphy"
              >
                Switch {isJapaneseName ? 'English' : 'Japanese'} (ナブニット)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scroll progress indicator */}
      <div ref={scrollProgressRef} className="scroll-progress" style={{ visibility: 'hidden' }}>
        <div className="scroll-text">SCROLL FLIGHT</div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(scrollProgress * 100, 100)}%` }}
          />
        </div>
        <div className="section-counter">
          0{currentSection + 1} / 0{totalSections + 1}
        </div>
      </div>

      {/* Virtual Scroll Height Track for prolonged space flight */}
      <div className="scroll-sections-track">
        <div className="content-section-virtual" />
        <div className="content-section-virtual" />
        <div className="content-section-virtual" />
      </div>
    </div>
  );
};

export default Component;
