import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbState } from '../../types/ui';

interface AmbientOrbProps {
  state?: OrbState;
  size?: number;
  className?: string;
  onClick?: () => void;
}

export const AmbientOrb: React.FC<AmbientOrbProps> = ({
  state = 'IDLE',
  size = 40,
  className = '',
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3.6;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;
      container.appendChild(renderer.domElement);
    } catch {
      return; // Graceful fallback to CSS gradient
    }

    // Geometry: Particle Sphere
    const particleCount = size > 60 ? 420 : 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Color definitions based on state
    const getColor = (s: OrbState) => {
      switch (s) {
        case 'LISTENING':
          return { primary: new THREE.Color('#38bdf8'), secondary: new THREE.Color('#818cf8') }; // Sky / Indigo
        case 'THINKING':
          return { primary: new THREE.Color('#a855f7'), secondary: new THREE.Color('#6366f1') }; // Purple / Violet
        case 'SPEAKING':
          return { primary: new THREE.Color('#34d399'), secondary: new THREE.Color('#06b6d4') }; // Emerald / Cyan
        case 'WORKING':
          return { primary: new THREE.Color('#fbbf24'), secondary: new THREE.Color('#10b981') }; // Amber / Emerald
        case 'IDLE':
        default:
          return { primary: new THREE.Color('#10b981'), secondary: new THREE.Color('#0ea5e9') }; // Calm Emerald / Ocean
      }
    };

    const currentPalette = getColor(state);

    // Populate particles on a sphere surface with slight depth
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 0.95 + Math.random() * 0.15;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      const mix = Math.random();
      const c = currentPalette.primary.clone().lerp(currentPalette.secondary, mix);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: size > 60 ? 0.055 : 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Satellite worker nodes for 'WORKING' state
    const satelliteGroup = new THREE.Group();
    if (state === 'WORKING') {
      const satCount = 3;
      const satGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const satMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      for (let i = 0; i < satCount; i++) {
        const satMesh = new THREE.Mesh(satGeo, satMat);
        const angle = (i / satCount) * Math.PI * 2;
        satMesh.position.set(Math.cos(angle) * 1.35, Math.sin(angle) * 1.35, 0);
        satelliteGroup.add(satMesh);
      }
      scene.add(satelliteGroup);
    }

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // State-specific motion dynamics
      let speed = 0.5;
      let waveAmp = 0.05;

      if (state === 'LISTENING') {
        speed = 1.8;
        waveAmp = 0.16;
      } else if (state === 'THINKING') {
        speed = 2.4;
        waveAmp = 0.12;
      } else if (state === 'SPEAKING') {
        speed = 1.4;
        waveAmp = 0.18;
      } else if (state === 'WORKING') {
        speed = 1.0;
        waveAmp = 0.08;
      }

      particles.rotation.y = elapsedTime * 0.3 * speed;
      particles.rotation.x = elapsedTime * 0.2 * speed;

      if (state === 'WORKING') {
        satelliteGroup.rotation.z = -elapsedTime * 1.2;
      }

      // Vertex wave displacement
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];
        const oz = originalPositions[i * 3 + 2];

        const wave = Math.sin(elapsedTime * 3.0 * speed + ox * 4.0 + oy * 4.0) * waveAmp;
        arr[i * 3] = ox * (1 + wave);
        arr[i * 3 + 1] = oy * (1 + wave);
        arr[i * 3 + 2] = oz * (1 + wave);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      if (rendererRef.current && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [state, size]);

  // Glow color ring for CSS fallback and ambient backdrop
  const glowBorderClass = {
    IDLE: 'from-emerald-500/30 to-cyan-500/20 shadow-emerald-500/20',
    LISTENING: 'from-sky-500/40 to-indigo-500/30 shadow-sky-500/30 animate-pulse',
    THINKING: 'from-purple-500/40 to-indigo-500/30 shadow-purple-500/30 animate-spin-slow',
    SPEAKING: 'from-emerald-500/40 to-cyan-500/30 shadow-emerald-500/30 animate-pulse',
    WORKING: 'from-amber-500/40 to-emerald-500/30 shadow-amber-500/30',
  }[state];

  return (
    <div
      onClick={onClick}
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center cursor-pointer select-none rounded-full group ${className}`}
      title={`OS Ambient Presence: ${state}`}
    >
      {/* Background Soft Glow Ring */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-tr ${glowBorderClass} blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
      />

      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="relative z-10 w-full h-full pointer-events-none" />

      {/* Reduced-Motion & Pure CSS Fallback Core */}
      <div
        className="absolute inset-1 rounded-full border border-white/20 bg-os-surface/40 backdrop-blur-sm -z-0 pointer-events-none"
      />
    </div>
  );
};
