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
      
      // Scene setup - deep pitch black space
      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025);

      // Camera
      refs.camera = new THREE.PerspectiveCamera(
        68,
        window.innerWidth / window.innerHeight,
        0.1,
        2500
      );
      refs.camera.position.set(0, 16, 320);

      // WebGL Renderer
      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 0.5; // Controlled exposure to prevent white blowout

      // Post-processing
      refs.composer = new EffectComposer(refs.renderer);
      const renderPass = new RenderPass(refs.scene, refs.camera);
      refs.composer.addPass(renderPass);

      // Bloom tuned so it never over-saturates into white
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.45,  // Gentle glowing bloom
        0.3,
        0.88   // High threshold to protect highlights
      );
      refs.composer.addPass(bloomPass);

      // Create celestial scene elements
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
            color.setHSL(0.55, 0.4, 0.9); // Starlight cyan
          } else if (colorChoice < 0.9) {
            color.setHSL(0.72, 0.5, 0.9); // Cosmic indigo
          } else {
            color.setHSL(0.08, 0.6, 0.95); // Golden spark
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
              float angle = time * 0.035 * (1.0 - depth * 0.25);
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
          color1: { value: new THREE.Color(0x0284c7) }, // Deep cyan
          color2: { value: new THREE.Color(0x4f46e5) }, // Deep indigo
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
            float mixFactor = sin(vUv.x * 8.0 + time * 0.5) * cos(vUv.y * 8.0 + time * 0.5);
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
      
      // Mountains kept strictly along the bottom horizon
      const layers = [
        { distance: -60, height: 40, color: 0x070b14, opacity: 1, baseOffsetY: -75 },
        { distance: -110, height: 55, color: 0x0c1427, opacity: 0.85, baseOffsetY: -85 },
        { distance: -160, height: 70, color: 0x111c38, opacity: 0.7, baseOffsetY: -95 },
        { distance: -220, height: 85, color: 0x082f49, opacity: 0.5, baseOffsetY: -105 },
      ];

      layers.forEach((layer, index) => {
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
          index 
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

      // Update stars
      refs.stars.forEach((starField) => {
        const mat = starField.material as THREE.ShaderMaterial;
        if (mat.uniforms && mat.uniforms.time) {
          mat.uniforms.time.value = time;
        }
      });

      // Update nebula
      if (refs.nebula) {
        const mat = refs.nebula.material as THREE.ShaderMaterial;
        if (mat.uniforms && mat.uniforms.time) {
          mat.uniforms.time.value = time * 0.5;
        }
      }

      // Smooth camera interpolation
      if (refs.camera && refs.targetCameraX !== undefined) {
        const smoothingFactor = 0.05;
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += ((refs.targetCameraY ?? 16) - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += ((refs.targetCameraZ ?? 320) - smoothCameraPos.current.z) * smoothingFactor;
        
        const floatX = Math.sin(time * 0.08) * 1.2;
        const floatY = Math.cos(time * 0.12) * 0.6;
        
        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, -10, -600);
      }

      // Parallax mountain horizon
      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.4;
        mountain.position.x = Math.sin(time * 0.09) * 1.5 * parallaxFactor;
        const baseY = mountain.userData.baseY ?? -75;
        mountain.position.y = baseY + (Math.cos(time * 0.12) * 0.8 * parallaxFactor);
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

  // Smooth scroll flight: Camera stays in safe stellar bounds (z: 320 -> 200) without blowing out
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
      
      // Camera gracefully moves forward in starfield, never entering the glowing atmosphere core!
      refs.targetCameraX = 0;
      refs.targetCameraY = 16 + rawProgress * 10;
      refs.targetCameraZ = 320 - rawProgress * 120; // safe range 320 -> 200

      // Mountains stay grounded at the horizon
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

      {/* Hero Content Overlay - Pure and focused on Nabnit's identity & motto */}
      <div 
        className={`hero-sticky-frame transition-opacity duration-500 ${
          scrollProgress > 0.95 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
          {/* Identity Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full border border-cyan-500/40 bg-cyan-950/60 backdrop-blur-md text-xs font-mono text-cyan-300 tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.35)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>GITHUB PROFILE // NAIKNABNIT</span>
            <span className="ml-2 pl-2 border-l border-cyan-500/40 text-[10px] text-cyan-400/90 font-semibold">
              {isJapanese ? 'JP // ナブニット' : 'EN // NABNIT'}
            </span>
          </div>

          {/* DYNAMIC TITLE: Timely Transition between NABNIT (EN) and Extracted Katakana Letters ナブニット (JP) */}
          <div className="relative min-h-[140px] md:min-h-[180px] flex items-center justify-center w-full my-1">
            {/* English Typography */}
            <h1
              className={`hero-title transition-all duration-700 absolute font-black tracking-[0.25em] ${
                !isJapanese
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
              }`}
            >
              NABNIT
            </h1>

            {/* Extracted Japanese Typography - Rendered with Styled Japanese Font, always 100% visible! */}
            <h1
              lang="ja"
              style={{ fontFamily: "'Noto Sans JP', 'Plus Jakarta Sans', sans-serif" }}
              className={`hero-title transition-all duration-700 absolute font-black tracking-[0.3em] ${
                isJapanese
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
              }`}
            >
              ナブニット
            </h1>
          </div>

          {/* Core Motto - "Curious by nature. Builder by choice." */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <blockquote className="text-xl md:text-3xl font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-indigo-200 italic filter drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              "Curious by nature. Builder by choice."
            </blockquote>
            <p className="text-sm md:text-base text-slate-300 font-normal tracking-wide mt-1">
              Computer Science Engineering • Developer • Problem Solver
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400/80 tracking-widest mt-1">
              <span>AI</span>
              <span>//</span>
              <span>FULL STACK</span>
              <span>//</span>
              <span>CLOUD</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {onScrollToContent && (
              <button 
                onClick={onScrollToContent}
                className="px-6 py-2.5 rounded-full border border-cyan-400/50 bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-200 text-sm font-mono tracking-wide transition-all duration-300 backdrop-blur-md cursor-pointer hover:shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:scale-105"
              >
                Explore Portfolio ↓
              </button>
            )}

            <button
              onClick={() => setIsJapanese(!isJapanese)}
              className="px-4 py-2 rounded-full border border-slate-700 bg-slate-900/70 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all backdrop-blur-sm cursor-pointer"
              title="Toggle English / Japanese Letters"
            >
              Switch {isJapanese ? 'English (NABNIT)' : 'Japanese (ナブニット)'}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll flight indicator */}
      <div ref={scrollProgressRef} className="scroll-progress" style={{ visibility: 'hidden' }}>
        <div className="scroll-text">SCROLL FLIGHT</div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(scrollProgress * 100, 100)}%` }}
          />
        </div>
        <div className="section-counter">
          {Math.round(scrollProgress * 100)}%
        </div>
      </div>

      {/* Virtual Scroll Height Track for prolonged space flight */}
      <div className="scroll-sections-track">
        <div className="content-section-virtual" />
        <div className="content-section-virtual" />
      </div>
    </div>
  );
};

export default Component;
