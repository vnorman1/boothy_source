
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <header className="text-center pt-24 pb-24 sm:pt-32 sm:pb-32 px-4">
      <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter">Boothy.</h1>
      <h2 className="mt-6 md:text-2xl sm:text-xl text-stone-600 max-w-2xl mx-auto">Egy digitális fotóautomata, ami a te zsebedben is elfér. Minőség, stílus és egyszerűség, egy helyen.</h2>
      <div className="mt-12">
        <a href="#studio" className="inline-block bg-stone-900 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105">Kezdjünk fotózni!</a>
      </div>
    </header>
  );
};

export default HeroSection;
