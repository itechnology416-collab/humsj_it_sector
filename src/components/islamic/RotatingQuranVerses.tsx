import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface QuranVerse {
  arabic: string;
  english: string;
  reference: string;
  theme: string;
  icon: string;
  color: string;
}

interface RotatingQuranVersesProps {
  verses: QuranVerse[];
  rotationSpeed?: number; // in seconds
  className?: string;
}

export function RotatingQuranVerses({ 
  verses, 
  rotationSpeed = 8, 
  className 
}: RotatingQuranVersesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRotating(true);
      
      // After rotation animation starts, change the verse
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % verses.length);
        setIsRotating(false);
      }, 500); // Half of the rotation duration
      
    }, rotationSpeed * 1000);

    return () => clearInterval(interval);
  }, [verses.length, rotationSpeed]);

  const currentVerse = verses[currentIndex];

  return (
    <div className={cn("relative perspective-1000", className)}>
      {/* 360 Degree Rotating Container */}
      <div 
        className={cn(
          "transform-gpu transition-transform duration-1000 ease-in-out preserve-3d",
          isRotating ? "rotate-y-360" : "rotate-y-0"
        )}
      >
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/30 max-w-4xl mx-auto shadow-2xl">
          {/* Theme Badge */}
          <div className="flex justify-center mb-6">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full border",
              `bg-gradient-to-r ${currentVerse.color} bg-opacity-20 border-opacity-30`
            )}>
              <span className="text-2xl animate-pulse">{currentVerse.icon}</span>
              <span className="text-sm font-medium">{currentVerse.theme}</span>
            </div>
          </div>

          {/* Arabic Text */}
          <div className="text-center mb-6">
            <p className="text-2xl md:text-3xl font-arabic text-primary mb-4 leading-relaxed animate-fade-in" dir="rtl">
              {currentVerse.arabic}
            </p>
          </div>

          {/* English Translation */}
          <div className="text-center mb-4">
            <p className="text-lg text-muted-foreground italic mb-2 animate-slide-up">
              "{currentVerse.english}"
            </p>
            <p className="text-sm text-primary font-medium animate-slide-up">
              - {currentVerse.reference}
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <div className={cn("w-16 h-0.5 bg-gradient-to-r", currentVerse.color, "animate-expand")} />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className={cn("w-16 h-0.5 bg-gradient-to-l", currentVerse.color, "animate-expand")} />
          </div>
        </div>
      </div>

      {/* Verse Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {verses.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex 
                ? "bg-primary scale-125 shadow-glow" 
                : "bg-border hover:bg-primary/50"
            )}
          />
        ))}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-1 h-1 rounded-full opacity-30 animate-float",
              `bg-gradient-to-r ${currentVerse.color}`
            )}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Rotation Progress Ring */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <div className="relative w-8 h-8">
          <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-border"
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray="87.96"
              strokeDashoffset="87.96"
              className="text-primary animate-progress-ring"
              style={{
                animationDuration: `${rotationSpeed}s`,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// CSS classes to add to your global CSS or Tailwind config
export const rotatingVersesStyles = `
  .perspective-1000 {
    perspective: 1000px;
  }
  
  .preserve-3d {
    transform-style: preserve-3d;
  }
  
  .rotate-y-360 {
    transform: rotateY(360deg);
  }
  
  .rotate-y-0 {
    transform: rotateY(0deg);
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
    50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
  }
  
  @keyframes expand {
    0% { width: 0; }
    100% { width: 4rem; }
  }
  
  @keyframes progress-ring {
    0% { stroke-dashoffset: 87.96; }
    100% { stroke-dashoffset: 0; }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-expand {
    animation: expand 0.5s ease-out;
  }
  
  .animate-progress-ring {
    animation: progress-ring linear infinite;
  }
  
  .shadow-glow {
    box-shadow: 0 0 20px rgba(var(--primary), 0.5);
  }
`;