import React, { useState } from 'react';

export interface Particle {
  id: number;
  x: number;
  y: number;
  char: string;
  color: string;
  size: number;
}

export const useCelebration = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const trigger = () => {
    const chars = ['🎵', '🎶', '✨', '🎉', '🌟', '❤️'];
    const colors = ['#630ed4', '#0058be', '#7c3aed', '#ae397b', '#facc15', '#ec4899'];
    const newParticles: Particle[] = Array.from({ length: 20 }).map((_, idx) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 60 + Math.random() * 100;
      return {
        id: Date.now() + idx,
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity - 30, // offset upwards
        char: chars[Math.floor(Math.random() * chars.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 14 + Math.random() * 14,
      };
    });
    setParticles(newParticles);
    
    // Cleanup particles
    setTimeout(() => {
      setParticles([]);
    }, 900);
  };

  const renderParticles = (left = '50%', top = '85%') => {
    return (
      <>
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute pointer-events-none select-none animate-fade-out-particle z-[100]"
            style={{
              left,
              top,
              color: p.color,
              fontSize: `${p.size}px`,
              transform: 'translate(-50%, -50%)',
              '--tx': `${p.x}px`,
              '--ty': `${p.y}px`,
            } as React.CSSProperties}
          >
            {p.char}
          </span>
        ))}
      </>
    );
  };

  return {
    particles,
    trigger,
    renderParticles,
  };
};
