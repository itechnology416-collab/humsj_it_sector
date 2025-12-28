import { useEffect, useRef } from 'react';

export default function Enhanced3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create floating particles
    const createParticles = () => {
      const container = containerRef.current;
      if (!container) return;

      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(particle);
      }
    };

    createParticles();

    // Cleanup
    return () => {
      const container = containerRef.current;
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Particle System */}
      <div ref={containerRef} className="particles" />
      
      {/* Floating 3D Shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 opacity-10">
        <div className="morphing-shape animate-3d-rotate" />
      </div>
      
      <div className="absolute top-40 right-20 w-24 h-24 opacity-10">
        <div className="morphing-shape animate-3d-flip" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="absolute bottom-40 left-1/4 w-16 h-16 opacity-10">
        <div className="morphing-shape animate-3d-bounce" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="absolute top-1/3 right-1/3 w-20 h-20 opacity-10">
        <div className="morphing-shape animate-rotate-slow" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <div className="absolute bottom-1/3 left-1/3 w-28 h-28 opacity-10">
        <div className="morphing-shape animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Geometric Patterns */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-5" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
            <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(229, 9, 20, 0.3)" />
              <stop offset="50%" stopColor="rgba(229, 9, 20, 0.1)" />
              <stop offset="100%" stopColor="rgba(229, 9, 20, 0.05)" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="200" cy="200" r="100" fill="url(#fadeGradient)" className="animate-pulse-slow" />
          <circle cx="800" cy="300" r="80" fill="url(#fadeGradient)" className="animate-bounce-slow" />
          <circle cx="300" cy="700" r="60" fill="url(#fadeGradient)" className="animate-float-up" />
          <circle cx="700" cy="800" r="120" fill="url(#fadeGradient)" className="animate-float-down" />
        </svg>
      </div>

      {/* Animated Lines */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-10" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="rgba(229, 9, 20, 0.6)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <line x1="0" y1="100" x2="1000" y2="100" stroke="url(#lineGradient)" strokeWidth="2" className="animate-slide-in-right" />
          <line x1="0" y1="300" x2="1000" y2="300" stroke="url(#lineGradient)" strokeWidth="2" className="animate-slide-in-left" style={{ animationDelay: '1s' }} />
          <line x1="0" y1="500" x2="1000" y2="500" stroke="url(#lineGradient)" strokeWidth="2" className="animate-slide-in-right" style={{ animationDelay: '2s' }} />
          <line x1="0" y1="700" x2="1000" y2="700" stroke="url(#lineGradient)" strokeWidth="2" className="animate-slide-in-left" style={{ animationDelay: '3s' }} />
          <line x1="0" y1="900" x2="1000" y2="900" stroke="url(#lineGradient)" strokeWidth="2" className="animate-slide-in-right" style={{ animationDelay: '4s' }} />
        </svg>
      </div>

      {/* Islamic Geometric Patterns */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="islamicPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <g fill="none" stroke="rgba(229, 9, 20, 0.3)" strokeWidth="1">
                <circle cx="50" cy="50" r="20" />
                <polygon points="30,30 70,30 70,70 30,70" />
                <path d="M30,50 Q50,30 70,50 Q50,70 30,50" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamicPattern)" className="animate-rotate-slow" />
        </svg>
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/30 rounded-full animate-float-up blur-sm" />
      <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-secondary/30 rounded-full animate-float-down blur-sm" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-accent/30 rounded-full animate-bounce-slow blur-sm" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-primary/30 rounded-full animate-pulse-slow blur-sm" style={{ animationDelay: '1.5s' }} />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-gradient-x" />
      <div className="absolute inset-0 bg-gradient-to-tl from-accent/5 via-transparent to-primary/5 animate-gradient-x" style={{ animationDelay: '2s' }} />
    </div>
  );
}