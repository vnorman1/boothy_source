import React, { useEffect, useState, useRef } from 'react';

// Győződj meg róla, hogy az itt lévő ID-k pontosan megegyeznek
// a HTML-ben lévő szekciók ID-jával.
const sections = [
  { id: 'studio', label: 'Stúdió' },
  { id: 'darkroom', label: 'Sötétkamra' },
  { id: 'gif', label: 'Animáció' },
  { id: 'gallery', label: 'Galéria' },
];

const NavSide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const [showNav, setShowNav] = useState(false);
  const [pillStyle, setPillStyle] = useState({});

  // Egy Map-et használunk a link elemek ref-jeinek tárolására
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  // Effekt a "mozgó pirula" pozíciójának frissítésére, amikor az aktív szekció vagy a refs változik
  useEffect(() => {
    // Frissítsd a refs-et, hogy mindig naprakész legyen
    const refs = itemRefs.current;
    // Ellenőrizd, hogy az aktív szekcióhoz tartozó ref létezik-e
    const activeItem = refs.get(activeSection);
    if (activeItem) {
      setPillStyle({
        height: `${activeItem.clientHeight}px`,
        transform: `translateY(${activeItem.offsetTop}px)`,
      });
    }
  }, [activeSection, sections.length]);

  // Effekt a görgetés figyelésére és az állapotok frissítésére
  useEffect(() => {
    const handleScroll = () => {
      // Navigáció megjelenítése, ha már legörgettünk a Hero szekció aljáról
      const hero = document.getElementById('hero');
      const shouldShow = hero ? hero.getBoundingClientRect().bottom < 100 : window.scrollY > 300;
      setShowNav(shouldShow);

      // Aktív szekció meghatározása
      let currentSection = activeSection;
      // Hátulról kezdjük a ciklust a pontosabb találatért (a legutolsó látható szekció lesz az aktív)
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Akkor aktív, ha a szekció teteje a viewport felső felénél feljebb van
          if (rect.top < window.innerHeight / 2) {
            currentSection = section.id;
            break; // Megvan a legfelső releváns szekció, kilépünk
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Kezdeti állapot beállítása betöltéskor

    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Üres függőségi lista, hogy csak egyszer fusson le a fel- és leiratkozás

  const handleLinkClick = (event: React.MouseEvent, sectionId: string) => {
    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    // Azonnali vizuális visszajelzés kattintáskor
    setActiveSection(sectionId);
  };

  return (
    <nav
      className={`
        fixed top-1/2 right-0 -translate-y-1/2 z-50
        hidden lg:flex flex-col items-stretch gap-1
        bg-white/80 backdrop-blur-md shadow-lg rounded-l-2xl border-l border-t border-b border-stone-200/80
        p-2 transition-all duration-500 ease-in-out
        ${showNav ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
      aria-label="Oldalsó navigáció"
    >
      {/* A "mozgó pirula" elem, ami az aktív link mögött mozog */}
      <div
        className="absolute left-0 top-0 w-full bg-orange-100/70 border-l-2 border-orange-500 rounded-lg -z-10 transition-all duration-300 ease-in-out"
        style={pillStyle}
      />
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          onClick={(e) => handleLinkClick(e, section.id)}
          // Ref beállítása a Map-ben, hogy tudjuk a pozícióját
          ref={(el) => {
            if (el) itemRefs.current.set(section.id, el);
            else itemRefs.current.delete(section.id);
          }}
          className={`
            relative block text-center px-4 py-2 rounded-md
            text-sm font-semibold whitespace-nowrap
            transition-colors duration-200 ease-in-out
            ${activeSection === section.id ? 'text-orange-600' : 'text-stone-600 hover:text-stone-900'}
          `}
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
};

export default NavSide;