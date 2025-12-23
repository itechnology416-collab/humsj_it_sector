import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  offset?: number;
  disabled?: boolean;
}

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  className,
  speed = 0.5,
  direction = 'up',
  offset = 0,
  disabled = false
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('translate3d(0, 0, 0)');

  useEffect(() => {
    if (disabled) return;

    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;
      
      let translateX = 0;
      let translateY = 0;

      switch (direction) {
        case 'up':
          translateY = rate + offset;
          break;
        case 'down':
          translateY = -rate + offset;
          break;
        case 'left':
          translateX = rate + offset;
          break;
        case 'right':
          translateX = -rate + offset;
          break;
      }

      setTransform(`translate3d(${translateX}px, ${translateY}px, 0)`);
    };

    // Initial call
    handleScroll();

    // Add scroll listener with throttling
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', scrollListener);
      window.removeEventListener('resize', handleScroll);
    };
  }, [speed, direction, offset, disabled]);

  return (
    <div
      ref={elementRef}
      className={cn('will-change-transform', className)}
      style={{
        transform: disabled ? 'none' : transform,
        transition: disabled ? 'none' : 'transform 0.1s ease-out'
      }}
    >
      {children}
    </div>
  );
};

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  className?: string;
  backgroundElements?: React.ReactNode;
  intensity?: 'subtle' | 'medium' | 'strong';
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  children,
  className,
  backgroundElements,
  intensity = 'medium'
}) => {
  const speeds = {
    subtle: { bg: 0.2, mid: 0.4, fg: 0.6 },
    medium: { bg: 0.3, mid: 0.5, fg: 0.7 },
    strong: { bg: 0.4, mid: 0.6, fg: 0.8 }
  };

  const currentSpeeds = speeds[intensity];

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Background Layer */}
      <ParallaxContainer
        speed={currentSpeeds.bg}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-xl" />
          <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-accent/20 to-transparent blur-lg" />
          <div className="absolute bottom-20 left-1/3 w-40 h-40 rounded-full bg-gradient-to-br from-secondary/20 to-transparent blur-2xl" />
        </div>
      </ParallaxContainer>

      {/* Custom Background Elements */}
      {backgroundElements && (
        <ParallaxContainer
          speed={currentSpeeds.mid}
          className="absolute inset-0 -z-5"
        >
          {backgroundElements}
        </ParallaxContainer>
      )}

      {/* Content Layer */}
      <ParallaxContainer
        speed={currentSpeeds.fg}
        className="relative z-10"
      >
        {children}
      </ParallaxContainer>
    </div>
  );
};

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  backgroundPattern?: 'dots' | 'grid' | 'waves' | 'islamic' | 'none';
  speed?: number;
  id?: string;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className,
  backgroundPattern = 'none',
  speed = 0.3,
  id
}) => {
  const getPatternBackground = () => {
    switch (backgroundPattern) {
      case 'dots':
        return (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
          </div>
        );
      case 'grid':
        return (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
          </div>
        );
      case 'waves':
        return (
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,10 Q25,0 50,10 T100,10 V20 H0 Z" fill="currentColor" opacity="0.1" />
              <path d="M0,15 Q25,5 50,15 T100,15 V20 H0 Z" fill="currentColor" opacity="0.05" />
            </svg>
          </div>
        );
      case 'islamic':
        return (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 text-6xl text-primary/20 font-arabic">﷽</div>
              <div className="absolute top-20 right-20 text-4xl text-accent/20 font-arabic">☪</div>
              <div className="absolute bottom-20 left-1/4 text-5xl text-secondary/20 font-arabic">🕌</div>
              <div className="absolute bottom-10 right-10 text-3xl text-primary/20 font-arabic">📿</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div id={id} className={cn('relative', className)}>
      <ParallaxContainer speed={speed * 0.5} className="absolute inset-0 -z-10">
        {getPatternBackground()}
      </ParallaxContainer>
      
      <ParallaxContainer speed={speed}>
        {children}
      </ParallaxContainer>
    </div>
  );
};

// Islamic-themed parallax decorations
export const IslamicParallaxDecorations: React.FC = () => {
  return (
    <>
      <ParallaxContainer speed={0.2} className="absolute top-20 left-10 -z-10">
        <div className="text-8xl text-primary/10 font-arabic animate-pulse">
          ﷽
        </div>
      </ParallaxContainer>
      
      <ParallaxContainer speed={0.4} direction="right" className="absolute top-40 right-20 -z-10">
        <div className="text-6xl text-accent/10 animate-bounce">
          ☪
        </div>
      </ParallaxContainer>
      
      <ParallaxContainer speed={0.3} className="absolute bottom-40 left-1/4 -z-10">
        <div className="text-7xl text-secondary/10 animate-pulse">
          🕌
        </div>
      </ParallaxContainer>
      
      <ParallaxContainer speed={0.5} direction="left" className="absolute bottom-20 right-1/3 -z-10">
        <div className="text-5xl text-primary/10 animate-bounce">
          📿
        </div>
      </ParallaxContainer>
      
      <ParallaxContainer speed={0.25} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 blur-3xl animate-pulse" />
      </ParallaxContainer>
    </>
  );
};