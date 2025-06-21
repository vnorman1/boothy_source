import React, { useState } from 'react';
// Tegyük fel, hogy ezek az ikonok léteznek az 'icons' mappában

// @ts-ignore
import './gif.js';
const GIF = (window as any).GIF;

interface DarkroomGifProps {
  photos: string[];
}

const DarkroomGif: React.FC<DarkroomGifProps> = ({ photos }) => {
  const [delay, setDelay] = useState(700);
  const [isGenerating, setIsGenerating] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!photos.length || isGenerating) return;
    setIsGenerating(true);
    setError(null);
    setGifUrl(null); // Újrageneráláskor töröljük a régit

const gif = new GIF({
  workers: 2,
  quality: 10,
  workerScript: new URL('../gif.worker.js', import.meta.url).toString(),
});

    const imageLoadPromises = photos.map(src => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    });

    Promise.all(imageLoadPromises).then(images => {
      images.forEach(img => gif.addFrame(img, { delay }));
      
      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        setGifUrl(url);
        setIsGenerating(false);
      });
      
      gif.render();
    }).catch(e => {
      setError('Hiba történt a képek betöltésekor a GIF készítéshez.');
      setIsGenerating(false);
    });
  };

  const handleDownload = () => {
    if (!gifUrl) return;
    const link = document.createElement('a');
    link.href = gifUrl;
    link.download = `boothy_animacio_${Date.now()}.gif`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleShare = async () => {
    // ... (a megosztás logikája változatlan)
    if (!gifUrl) return;
    try {
      const response = await fetch(gifUrl);
      const blob = await response.blob();
      if (navigator.share && blob) {
        await navigator.share({
          files: [new File([blob], `boothy_animacio.gif`, { type: 'image/gif' })],
          title: 'Boothy GIF-em',
          text: 'Nézd meg ezt a GIF-et, amit a Boothy appal csináltam! https://vnorman1.github.io/boothy/',
        });
      } else {
        alert('A böngésződ nem támogatja a közvetlen megosztást. Próbáld meg letölteni és manuálisan megosztani.');
      }
    } catch (e) {
      console.error('Megosztási hiba:', e);
      alert('A megosztás nem sikerült vagy a felhasználó megszakította.');
    }
  };

  const scrollToStudio = () => {
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section id="gif" className="relative py-16 sm:py-24 border-t-2 border-stone-200">
      <div className="absolute top-0 left-0 wow-number font-serif font-extrabold text-[15rem] sm:text-[20rem] text-stone-200/60 opacity-50 select-none pointer-events-none">02</div>
      
      <div className="relative z-10">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Animált GIF Készítő</h2>
        <p className="text-lg text-stone-600 mb-12">Keltsd életre a fotóidat! Állítsd be a sebességet és hozz létre egyedi animációt.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* ELŐNÉZET (BAL OLDAL) */}
          <div className="w-full lg:sticky lg:top-12">
            <h3 className="font-bold text-xl mb-4">Animáció Előnézet</h3>
            <div className="relative aspect-square bg-stone-100 rounded-xl border-2 border-stone-200 p-4 flex items-center justify-center overflow-hidden">
              {/* Generált GIF - MOST MÁR HOVER EFFEKT NÉLKÜL */}
              {gifUrl && (
                <img src={gifUrl} loading='lazy' alt="Generált GIF előnézet" className="max-w-full max-h-full object-contain rounded-lg transition-opacity duration-500" />
              )}
              
              {/* Nincs GIF, de vannak képek */}
              {!gifUrl && photos.length > 0 && (
                <div className="grid gap-2 w-full grid-cols-2 sm:grid-cols-3">
                  {photos.map((photoSrc, index) => (
                    <img key={index} src={photoSrc} alt={`Forráskép ${index + 1}`} className="w-full aspect-square object-cover rounded-md" />
                  ))}
                </div>
              )}

              {/* Üres állapot: Nincs kép */}
              {!gifUrl && photos.length === 0 && (
                <div className="text-center text-stone-500 flex flex-col items-center gap-4 p-4">
                  
                  <p className="font-medium">Nincsenek képek az animáció készítéshez.</p>
                  <button onClick={scrollToStudio} className="bg-stone-800 hover:bg-stone-900 text-white font-bold py-2 px-5 rounded-full transition-colors text-sm flex items-center justify-center gap-2 shadow">
                    Irány a Stúdió
                  </button>
                </div>
              )}

              {/* Generálás közbeni overlay */}
              {isGenerating && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 transition-opacity duration-300">
                  <svg className="animate-spin h-10 w-10 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-stone-700 font-medium">Animáció készítése...</p>
                </div>
              )}
            </div>
          </div>

          {/* VEZÉRLŐPULT (JOBB OLDAL) */}
          <div className="flex flex-col gap-10">
            {/* Beállítások */}
            <div>
              <h3 className="font-bold text-xl mb-5">Beállítások</h3>
              <div className="p-6 bg-white/70 rounded-xl border border-stone-200">
                <label htmlFor="gif-delay-slider" className="font-medium text-stone-700 mb-3 block">Képkockák sebessége:</label>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-stone-500">GYORSABB</span>
                  <input
                    id="gif-delay-slider"
                    type="range" min={100} max={2000} step={50}
                    value={delay}
                    onChange={e => setDelay(Number(e.target.value))}
                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    disabled={isGenerating}
                  />
                  <span className="text-xs font-semibold text-stone-500">LASSABB</span>
                </div>
               {/* <div className="text-center mt-2 font-mono text-stone-800">{delay} ms</div> */}
              </div>
            </div>

            {/* Akciók */}
            <div className="flex flex-col items-center gap-4">
              {/* Elsődleges/Másodlagos Akciógomb */}
              {!gifUrl ? (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || photos.length === 0}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-5 px-6 rounded-2xl transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300 shadow-xl shadow-amber-500/30 text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  
                  <span>{isGenerating ? 'Folyamatban...' : 'Animáció Készítése'}</span>
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-stone-900 hover:bg-stone-700 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  
                  <span>Újragenerálás más beállítással</span>
                </button>
              )}
              {error && <p className="text-red-600 text-center text-sm">{error}</p>}
              
              {/* LETÖLTÉS ÉS MEGOSZTÁS SZEKCIÓ */}
              {gifUrl && !isGenerating && (
                 <div className="w-full border-t border-stone-200 mt-6 pt-6 grid sm:grid-cols-2 gap-8">
                    <button
                        onClick={handleDownload}
                        className="w-full bg-stone-800 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded-full transition flex items-center justify-center gap-2.5"
                    >Letöltés
                    </button>
                    <button
                        onClick={handleShare}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-full transition flex items-center justify-center gap-2.5"
                    >
                        
                        Megosztás
                    </button>
                 </div>
              )}
            </div>
            
            <p className="text-stone-500 text-sm text-center">
              Az elkészült animációk a böngésződben jönnek létre, adataid biztonságban vannak.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DarkroomGif;