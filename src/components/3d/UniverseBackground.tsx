import { useEffect, useRef, useState } from 'react';

interface UniverseBackgroundProps {
  variant?: 'index' | 'auth';
}

export default function UniverseBackground({ variant = 'index' }: UniverseBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !starsRef.current) return;

    // Create stars
    const createStars = () => {
      const starsContainer = starsRef.current;
      if (!starsContainer) return;

      const starCount = variant === 'index' ? 200 : 150;
      
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'universe-star';
        
        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        // Random size (1-4px)
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        // Random animation delay and duration
        star.style.animationDelay = Math.random() * 5 + 's';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        // Random opacity
        star.style.opacity = (Math.random() * 0.8 + 0.2).toString();
        
        // Add parallax data attribute
        star.setAttribute('data-speed', (Math.random() * 0.5 + 0.1).toString());
        
        starsContainer.appendChild(star);
      }
    };

    // Create shooting stars
    const createShootingStars = () => {
      const container = containerRef.current;
      if (!container) return;

      const shootingStarCount = variant === 'index' ? 5 : 3;
      
      for (let i = 0; i < shootingStarCount; i++) {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        
        // Random starting position
        shootingStar.style.left = Math.random() * 100 + '%';
        shootingStar.style.top = Math.random() * 50 + '%';
        
        // Random animation delay (spread over 10 seconds)
        shootingStar.style.animationDelay = Math.random() * 10 + 's';
        
        container.appendChild(shootingStar);
      }
    };

    // Create nebula clouds
    const createNebulaClouds = () => {
      const container = containerRef.current;
      if (!container) return;

      const nebulaCount = variant === 'index' ? 4 : 2;
      
      for (let i = 0; i < nebulaCount; i++) {
        const nebula = document.createElement('div');
        nebula.className = 'nebula-cloud';
        
        // Random position
        nebula.style.left = Math.random() * 80 + '%';
        nebula.style.top = Math.random() * 80 + '%';
        
        // Random size
        const size = Math.random() * 300 + 200;
        nebula.style.width = size + 'px';
        nebula.style.height = size + 'px';
        
        // Random animation delay
        nebula.style.animationDelay = Math.random() * 8 + 's';
        
        // Add parallax data attribute
        nebula.setAttribute('data-speed', (Math.random() * 0.3 + 0.1).toString());
        
        container.appendChild(nebula);
      }
    };

    // Create floating planets
    const createPlanets = () => {
      const container = containerRef.current;
      if (!container) return;

      const planetCount = variant === 'index' ? 3 : 2;
      
      for (let i = 0; i < planetCount; i++) {
        const planet = document.createElement('div');
        planet.className = `planet planet-${i + 1}`;
        
        // Specific positions for each planet
        const positions = [
          { left: '10%', top: '20%' },
          { left: '85%', top: '60%' },
          { left: '20%', top: '80%' }
        ];
        
        if (positions[i]) {
          planet.style.left = positions[i].left;
          planet.style.top = positions[i].top;
        }
        
        // Random animation delay
        planet.style.animationDelay = i * 2 + 's';
        
        // Add parallax data attribute
        planet.setAttribute('data-speed', (Math.random() * 0.4 + 0.2).toString());
        
        container.appendChild(planet);
      }
    };

    // Create 3D stars with depth
    const create3DStars = () => {
      const container = containerRef.current;
      if (!container) return;

      const star3DCount = variant === 'index' ? 15 : 10;
      
      for (let i = 0; i < star3DCount; i++) {
        const star3D = document.createElement('div');
        star3D.className = 'star-3d';
        
        // Random position
        star3D.style.left = Math.random() * 100 + '%';
        star3D.style.top = Math.random() * 100 + '%';
        
        // Random size and depth
        const size = Math.random() * 8 + 4;
        star3D.style.width = size + 'px';
        star3D.style.height = size + 'px';
        
        // Random animation delay
        star3D.style.animationDelay = Math.random() * 5 + 's';
        
        // Add depth layers
        const depth = Math.random() * 3;
        star3D.setAttribute('data-depth', depth.toString());
        star3D.setAttribute('data-speed', (depth * 0.3 + 0.1).toString());
        
        // Create inner glow
        const innerGlow = document.createElement('div');
        innerGlow.className = 'star-3d-glow';
        star3D.appendChild(innerGlow);
        
        container.appendChild(star3D);
      }
    };

    // Create 3D planets with rings and moons
    const create3DPlanets = () => {
      const container = containerRef.current;
      if (!container) return;

      const planet3DCount = variant === 'index' ? 2 : 1;
      
      for (let i = 0; i < planet3DCount; i++) {
        const planetContainer = document.createElement('div');
        planetContainer.className = 'planet-3d-container';
        
        // Position
        const positions = [
          { left: '15%', top: '25%' },
          { left: '80%', top: '70%' }
        ];
        
        if (positions[i]) {
          planetContainer.style.left = positions[i].left;
          planetContainer.style.top = positions[i].top;
        }
        
        // Create planet
        const planet3D = document.createElement('div');
        planet3D.className = `planet-3d planet-3d-${i + 1}`;
        
        // Create rings
        const ring = document.createElement('div');
        ring.className = 'planet-ring';
        
        // Create moon
        const moon = document.createElement('div');
        moon.className = 'planet-moon';
        
        // Add parallax
        planetContainer.setAttribute('data-speed', (Math.random() * 0.3 + 0.2).toString());
        
        planetContainer.appendChild(planet3D);
        planetContainer.appendChild(ring);
        planetContainer.appendChild(moon);
        container.appendChild(planetContainer);
      }
    };

    // Create animated snakes
    const createSnakes = () => {
      const container = containerRef.current;
      if (!container) return;

      const snakeCount = variant === 'index' ? 3 : 2;
      
      for (let i = 0; i < snakeCount; i++) {
        const snake = document.createElement('div');
        snake.className = `cosmic-snake cosmic-snake-${i + 1}`;
        
        // Create snake body segments
        const segmentCount = 8;
        for (let j = 0; j < segmentCount; j++) {
          const segment = document.createElement('div');
          segment.className = 'snake-segment';
          segment.style.animationDelay = (j * 0.1 + i * 2) + 's';
          snake.appendChild(segment);
        }
        
        // Position snakes
        const positions = [
          { left: '5%', top: '30%' },
          { left: '90%', top: '60%' },
          { left: '40%', top: '10%' }
        ];
        
        if (positions[i]) {
          snake.style.left = positions[i].left;
          snake.style.top = positions[i].top;
        }
        
        // Add parallax
        snake.setAttribute('data-speed', (Math.random() * 0.2 + 0.1).toString());
        
        container.appendChild(snake);
      }
    };

    // Create floating asteroids
    const createAsteroids = () => {
      const container = containerRef.current;
      if (!container) return;

      const asteroidCount = variant === 'index' ? 4 : 2;
      
      for (let i = 0; i < asteroidCount; i++) {
        const asteroid = document.createElement('div');
        asteroid.className = `asteroid asteroid-${i + 1}`;
        
        // Random position
        asteroid.style.left = Math.random() * 90 + '%';
        asteroid.style.top = Math.random() * 90 + '%';
        
        // Random size
        const size = Math.random() * 30 + 20;
        asteroid.style.width = size + 'px';
        asteroid.style.height = size + 'px';
        
        // Random animation delay
        asteroid.style.animationDelay = Math.random() * 10 + 's';
        
        // Add parallax
        asteroid.setAttribute('data-speed', (Math.random() * 0.3 + 0.1).toString());
        
        container.appendChild(asteroid);
      }
    };

    // Create cosmic portals
    const createPortals = () => {
      const container = containerRef.current;
      if (!container) return;

      const portalCount = variant === 'index' ? 2 : 1;
      
      for (let i = 0; i < portalCount; i++) {
        const portal = document.createElement('div');
        portal.className = `cosmic-portal cosmic-portal-${i + 1}`;
        
        // Position portals
        const positions = [
          { left: '20%', top: '30%' },
          { left: '75%', top: '70%' }
        ];
        
        if (positions[i]) {
          portal.style.left = positions[i].left;
          portal.style.top = positions[i].top;
        }
        
        // Create portal rings
        for (let j = 0; j < 3; j++) {
          const ring = document.createElement('div');
          ring.className = `portal-ring portal-ring-${j + 1}`;
          portal.appendChild(ring);
        }
        
        // Add parallax
        portal.setAttribute('data-speed', (Math.random() * 0.2 + 0.1).toString());
        
        container.appendChild(portal);
      }
    };

    createStars();
    createShootingStars();
    createNebulaClouds();
    createPlanets();
    create3DStars();
    create3DPlanets();
    createSnakes();
    createAsteroids();
    createPortals();

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      if (starsRef.current) {
        starsRef.current.innerHTML = '';
      }
    };
  }, [variant]);

  // Apply parallax effect
  useEffect(() => {
    const applyParallax = () => {
      const elements = document.querySelectorAll('[data-speed]');
      elements.forEach((element) => {
        const speed = parseFloat(element.getAttribute('data-speed') || '0');
        const x = mousePosition.x * speed * 20;
        const y = mousePosition.y * speed * 20;
        (element as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    applyParallax();
  }, [mousePosition]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none universe-container">
      {/* Deep space gradient background */}
      <div className="absolute inset-0 universe-gradient" />
      
      {/* Stars layer */}
      <div ref={starsRef} className="absolute inset-0 stars-layer" />
      
      {/* Main universe elements container */}
      <div ref={containerRef} className="absolute inset-0" />
      
      {/* Galaxy spiral */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="galaxy-spiral" 
          style={{
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
          }}
        />
      </div>
      
      {/* Cosmic dust particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="cosmic-dust"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 10 + 's',
              animationDuration: (Math.random() * 20 + 10) + 's'
            }}
          />
        ))}
      </div>
      
      {/* 3D Stars layer */}
      <div className="absolute inset-0">
        {Array.from({ length: variant === 'index' ? 8 : 5 }).map((_, i) => (
          <div
            key={`3d-star-${i}`}
            className="star-3d"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              transform: `translate(${mousePosition.x * (i + 1) * 5}px, ${mousePosition.y * (i + 1) * 5}px)`
            }}
          >
            <div className="star-3d-glow" />
          </div>
        ))}
      </div>
      
      {/* Floating 3D geometric shapes */}
      <div className="absolute inset-0">
        {Array.from({ length: variant === 'index' ? 6 : 4 }).map((_, i) => (
          <div
            key={`3d-shape-${i}`}
            className={`absolute animate-float-3d shape-3d-${i + 1}`}
            style={{
              left: Math.random() * 90 + '%',
              top: Math.random() * 90 + '%',
              animationDelay: i * 1.5 + 's',
              transform: `translate(${mousePosition.x * (i + 2) * 3}px, ${mousePosition.y * (i + 2) * 3}px)`
            }}
          />
        ))}
      </div>
      
      {/* Constellation lines */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-20" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="constellationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
              <stop offset="50%" stopColor="rgba(100, 200, 255, 0.5)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.3)" />
            </linearGradient>
          </defs>
          
          {/* Constellation patterns */}
          <g stroke="url(#constellationGradient)" strokeWidth="1" fill="none" className="constellation-lines">
            <path d="M100,200 L200,150 L300,180 L250,280 L150,300 Z" className="animate-constellation-glow" />
            <path d="M700,100 L800,120 L850,200 L780,250 L720,180 Z" className="animate-constellation-glow" style={{ animationDelay: '2s' }} />
            <path d="M400,600 L500,550 L600,580 L550,680 L450,700 Z" className="animate-constellation-glow" style={{ animationDelay: '4s' }} />
          </g>
          
          {/* Constellation stars */}
          <g fill="rgba(255, 255, 255, 0.8)">
            <circle cx="100" cy="200" r="2" className="animate-star-twinkle" />
            <circle cx="200" cy="150" r="3" className="animate-star-twinkle" style={{ animationDelay: '0.5s' }} />
            <circle cx="300" cy="180" r="2" className="animate-star-twinkle" style={{ animationDelay: '1s' }} />
            <circle cx="700" cy="100" r="3" className="animate-star-twinkle" style={{ animationDelay: '1.5s' }} />
            <circle cx="800" cy="120" r="2" className="animate-star-twinkle" style={{ animationDelay: '2s' }} />
            <circle cx="400" cy="600" r="2" className="animate-star-twinkle" style={{ animationDelay: '2.5s' }} />
          </g>
        </svg>
      </div>
      
      {/* Cosmic energy waves */}
      <div className="absolute inset-0">
        <div className="cosmic-wave cosmic-wave-1" />
        <div className="cosmic-wave cosmic-wave-2" />
        <div className="cosmic-wave cosmic-wave-3" />
      </div>
      
      {/* Pulsating energy orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: variant === 'index' ? 5 : 3 }).map((_, i) => (
          <div
            key={`energy-orb-${i}`}
            className="energy-orb"
            style={{
              left: Math.random() * 90 + '%',
              top: Math.random() * 90 + '%',
              animationDelay: i * 2 + 's',
              transform: `translate(${mousePosition.x * (i + 1) * 8}px, ${mousePosition.y * (i + 1) * 8}px)`
            }}
          >
            <div className="orb-core" />
            <div className="orb-ring orb-ring-1" />
            <div className="orb-ring orb-ring-2" />
            <div className="orb-ring orb-ring-3" />
          </div>
        ))}
      </div>
      
      {/* Cosmic lightning */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-30" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(100, 200, 255, 0.8)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 1)" />
              <stop offset="100%" stopColor="rgba(255, 100, 200, 0.8)" />
            </linearGradient>
          </defs>
          
          {/* Lightning bolts */}
          <g stroke="url(#lightningGradient)" strokeWidth="2" fill="none" className="cosmic-lightning">
            <path d="M100,100 L150,200 L120,250 L180,350 L140,400" className="animate-lightning-flash" />
            <path d="M800,150 L750,250 L780,300 L720,400 L760,450" className="animate-lightning-flash" style={{ animationDelay: '3s' }} />
            <path d="M400,50 L450,150 L420,200 L480,300 L440,350" className="animate-lightning-flash" style={{ animationDelay: '6s' }} />
          </g>
        </svg>
      </div>
      
      {/* Floating asteroids */}
      <div className="absolute inset-0">
        {Array.from({ length: variant === 'index' ? 4 : 2 }).map((_, i) => (
          <div
            key={`asteroid-${i}`}
            className={`asteroid asteroid-${i + 1}`}
            style={{
              left: Math.random() * 90 + '%',
              top: Math.random() * 90 + '%',
              width: Math.random() * 30 + 20 + 'px',
              height: Math.random() * 30 + 20 + 'px',
              animationDelay: Math.random() * 10 + 's',
              transform: `translate(${mousePosition.x * (i + 1) * 4}px, ${mousePosition.y * (i + 1) * 4}px)`
            }}
          />
        ))}
      </div>
      
      {/* Cosmic portals */}
      <div className="absolute inset-0">
        {Array.from({ length: variant === 'index' ? 2 : 1 }).map((_, i) => (
          <div
            key={`portal-${i}`}
            className={`cosmic-portal cosmic-portal-${i + 1}`}
            style={{
              left: i === 0 ? '20%' : '75%',
              top: i === 0 ? '30%' : '70%',
              animationDelay: i * 3 + 's',
              transform: `translate(${mousePosition.x * (i + 1) * 6}px, ${mousePosition.y * (i + 1) * 6}px)`
            }}
          >
            <div className="portal-ring portal-ring-1" />
            <div className="portal-ring portal-ring-2" />
            <div className="portal-ring portal-ring-3" />
          </div>
        ))}
      </div>
      
      {/* Subtle overlay to maintain readability */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}