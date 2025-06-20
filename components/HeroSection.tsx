import React from 'react';
import { motion } from 'framer-motion';

// --- Címsor animáció (változatlan, mert már tökéletes) ---
const text = "Boothy.";
const h1Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  }),
};

// --- Újrahasználható komponens az áramló SVG vonalakhoz ---
interface FlowingSvgProps {
  pathData: string;
  className?: string;
  animationConfig: {
    duration: number;
    delay?: number;
    initialY: string;
    initialX?: string;
  };
}

const FlowingSvg: React.FC<FlowingSvgProps> = ({ pathData, className, animationConfig }) => (
  <motion.svg
    className={`absolute w-full -z-10 ${className}`}
    viewBox="0 0 1440 100"
    preserveAspectRatio="none"
    initial={{ x: animationConfig.initialX || '-100%', y: animationConfig.initialY }}
    animate={{ x: '100%' }}
    transition={{
      duration: animationConfig.duration,
      delay: animationConfig.delay || 0,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'linear',
    }}
  >
    <motion.path d={pathData} strokeWidth="2" fill="none" />
  </motion.svg>
);

// --- Animált körök komponens ---
const AnimatedCircles: React.FC = () => {
  const circles = [
    { size: 120, x: '15%', y: '20%', delay: 0, duration: 8 },
    { size: 80, x: '85%', y: '30%', delay: 1.5, duration: 10 },
    { size: 150, x: '10%', y: '70%', delay: 3, duration: 12 },
    { size: 60, x: '80%', y: '75%', delay: 0.8, duration: 9 },
    { size: 200, x: '50%', y: '15%', delay: 2, duration: 15 },
    { size: 40, x: '70%', y: '50%', delay: 4, duration: 7 },
  ];

  return (
    <>
      {circles.map((circle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full border-2 border-amber-200/30"
          style={{
            width: circle.size,
            height: circle.size,
            left: circle.x,
            top: circle.y,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ 
            scale: 0,
            rotate: 0,
            strokeDasharray: "0 100",
          }}
          animate={{ 
            scale: [0, 1.2, 1],
            rotate: 360,
            strokeDasharray: ["0 100", "50 50", "100 0", "0 100"],
          }}
          transition={{
            duration: circle.duration,
            delay: circle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

// --- Lebegő geometriai formák ---
const FloatingShapes: React.FC = () => {
  const shapes = [
    { type: 'triangle', x: '20%', y: '25%', delay: 1, duration: 6 },
    { type: 'square', x: '75%', y: '20%', delay: 2.5, duration: 8 },
    { type: 'diamond', x: '25%', y: '80%', delay: 0.5, duration: 7 },
    { type: 'hexagon', x: '85%', y: '65%', delay: 3.5, duration: 9 },
  ];

  const renderShape = (type: string, size: number = 30) => {
    switch (type) {
      case 'triangle':
        return (
          <svg width={size} height={size} viewBox="0 0 30 30">
            <polygon points="15,2 28,26 2,26" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
      case 'square':
        return (
          <svg width={size} height={size} viewBox="0 0 30 30">
            <rect x="4" y="4" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
      case 'diamond':
        return (
          <svg width={size} height={size} viewBox="0 0 30 30">
            <polygon points="15,2 28,15 15,28 2,15" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
      case 'hexagon':
        return (
          <svg width={size} height={size} viewBox="0 0 30 30">
            <polygon points="15,2 26,8.5 26,21.5 15,28 4,21.5 4,8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute text-stone-300/40"
          style={{
            left: shape.x,
            top: shape.y,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ 
            y: 0, 
            rotate: 0, 
            opacity: 0.3,
            scale: 0.8 
          }}
          animate={{ 
            y: [-20, 20, -20], 
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {renderShape(shape.type, 40)}
        </motion.div>
      ))}
    </>
  );
};

// --- Pusztító részecskék effekt ---
const ParticleField: React.FC = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 6,
    size: 2 + Math.random() * 4,
  }));

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-amber-300/20 rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ 
            opacity: 0,
            scale: 0,
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
};

// --- Dinamikus vonalak hálózat ---
const DynamicLines: React.FC = () => {
  const lines = [
    { start: { x: 10, y: 20 }, end: { x: 40, y: 60 }, delay: 1 },
    { start: { x: 60, y: 30 }, end: { x: 90, y: 20 }, delay: 2 },
    { start: { x: 20, y: 80 }, end: { x: 70, y: 70 }, delay: 0.5 },
    { start: { x: 80, y: 80 }, end: { x: 50, y: 40 }, delay: 1.5 },
  ];

  return (
    <svg className="absolute inset-0 w-full h-full -z-5" viewBox="0 0 100 100" preserveAspectRatio="none">
      {lines.map((line, index) => (
        <motion.line
          key={index}
          x1={line.start.x}
          y1={line.start.y}
          x2={line.end.x}
          y2={line.end.y}
          stroke="rgb(245 158 11 / 0.1)"
          strokeWidth="0.2"
          initial={{ 
            pathLength: 0,
            opacity: 0,
          }}
          animate={{ 
            pathLength: [0, 1, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4,
            delay: line.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
};

// --- A FŐ HERO KOMPONENS ---
const HeroSection: React.FC = () => {
  return (
    <header
      id="hero"
      className="relative flex flex-col items-center justify-center min-h-180 px-4 overflow-hidden bg-stone-50"
    >
      {/* Háttér animációk rétegei */}
      <AnimatedCircles />
      <FloatingShapes />
      <ParticleField />
      <DynamicLines />
      
      {/* Finom gradient overlay a jobb kontraszthoz */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-50/80 via-transparent to-amber-50/30 -z-1"></div>

      {/* Fő tartalom */}
      <div className="relative z-10 text-center">
        <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter flex justify-center">
          {text.split("").map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={h1Variants}
              initial="hidden"
              animate="visible"
              style={{ display: 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h1>
        <motion.h2
          className="mt-6 text-lg md:text-2xl text-stone-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.8 }}
        >
          Egy digitális fotóautomata, ami a te zsebedben is elfér. Minőség, stílus és egyszerűség, egy helyen.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10, delay: 1.2 }}
        >
          <motion.a
            href="#studio"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block mt-12 bg-amber-600 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300 shadow-lg shadow-amber-500/30"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 20px 40px rgba(245, 158, 11, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Kezdjünk fotózni!
          </motion.a>
        </motion.div>
      </div>

      {/* Görgetést jelző nyíl - továbbfejlesztett animációval */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <a href="#studio" onClick={(e) => { e.preventDefault(); document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' }); }}>
          <motion.svg
            className="w-6 h-6 text-stone-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ 
              y: [0, 8, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            whileHover={{ scale: 1.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </a>
      </motion.div>
    </header>
  );
};

export default HeroSection;