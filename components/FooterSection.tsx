
import React from 'react';

const FooterSection: React.FC = () => {
  return (
    <footer className="text-center py-16 mt-16 bg-stone-900 text-stone-300">
      <p className="text-sm">© {new Date().getFullYear()} - A Te Photobooth Projekted. Egy ötlet validálása.</p>
      <p className="text-xs text-stone-500 mt-2">Designed & Developed by [V.N.]</p>
    </footer>
  );
};

export default FooterSection;
