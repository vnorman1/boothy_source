import React from 'react';
import { motion } from 'framer-motion';

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

const HeroSection: React.FC = () => {
  return (
    <header className="text-center pt-24 pb-24 sm:pt-32 sm:pb-32 px-4">
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
        className="mt-6 md:text-2xl sm:text-xl text-stone-600 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.8 }}
      >
        Egy digitális fotóautomata, ami a te zsebedben is elfér. Minőség, stílus és egyszerűség, egy helyen.
      </motion.h2>
      <div className="mt-12">
        <a href="#studio" className="inline-block bg-stone-900 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105">Kezdjünk fotózni!</a>
      </div>
    </header>
  );
};

export default HeroSection;
