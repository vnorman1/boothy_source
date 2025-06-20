import React from 'react';
import { FilterType, LayoutType } from '../types';
import { FILTER_OPTIONS, PLACEHOLDER_PORTRAITS } from '../constants';
import { DownloadIcon, ShareIcon } from './icons';

interface GallerySectionProps {
  finalImage: string | null;
  selectedFilter: FilterType;
  onDownload: () => void;
  onShare: () => void;
  onNewPhotoshoot: () => void;
  isLoading: boolean;
  currentLayout: LayoutType;
}

const GallerySection: React.FC<GallerySectionProps> = ({ 
    finalImage, selectedFilter, onDownload, onShare, onNewPhotoshoot, isLoading, currentLayout 
}) => {
  const activeFilterData = FILTER_OPTIONS.find(f => f.id === selectedFilter);

  // Segédfüggvény: Sepia filter pixelenként
  function applySepiaToCanvas(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Sepia formula
      data[i]     = Math.min(0.393 * r + 0.769 * g + 0.189 * b, 255);
      data[i + 1] = Math.min(0.349 * r + 0.686 * g + 0.168 * b, 255);
      data[i + 2] = Math.min(0.272 * r + 0.534 * g + 0.131 * b, 255);
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // Új letöltés logika: mindig filterezett képet töltsön le
  const handleFilteredDownload = () => {
    if (!finalImage) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      if (selectedFilter === FilterType.Sepia) {
        applySepiaToCanvas(ctx, canvas.width, canvas.height);
      } else if (selectedFilter === FilterType.BlackAndWhite) {
        // Grayscale filter pixelenként
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          data[i] = data[i + 1] = data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);
      } // Vintage filtert is lehetne így, de most a sepia a fő
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.download = `photobooth_image_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.crossOrigin = 'anonymous';
    img.src = finalImage;
  };

  // Megosztás filterezett képpel
  const handleFilteredShare = async () => {
    if (!finalImage) return;
    const img = new window.Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      if (selectedFilter === FilterType.Sepia) {
        applySepiaToCanvas(ctx, canvas.width, canvas.height);
      } else if (selectedFilter === FilterType.BlackAndWhite) {
        // Grayscale filter pixelenként
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          data[i] = data[i + 1] = data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      canvas.toBlob(async (blob) => {
        if (blob && navigator.share) {
          try {
            await navigator.share({
              files: [new File([blob], `photobooth_image_${Date.now()}.jpg`, { type: 'image/jpeg' })],
              title: 'Photobooth Képem',
              text: 'Nézd meg ezt a képet, amit a Photobooth appal csináltam!',
            });
          } catch (error) {
            if (!(error && (error as any).name === 'AbortError')) {
              alert('Megosztás nem sikerült vagy megszakították.');
            }
          }
        } else if (blob) {
          alert('A böngésződ nem támogatja a közvetlen megosztást. Próbáld meg letölteni és manuálisan megosztani.');
        } else {
          alert('Megosztás nem sikerült: Hiba a képfájl létrehozásakor.');
        }
      }, 'image/jpeg', 0.95);
    };
    img.crossOrigin = 'anonymous';
    img.src = finalImage;
  };

  const renderFinalImage = () => {
    if (isLoading) {
      return <div className="w-full aspect-[1/1] flex items-center justify-center bg-stone-100 rounded-md"><p className="text-stone-500">Kép generálása...</p></div>;
    }
    if (finalImage) {
      const imgClasses = `w-full h-full object-contain ${activeFilterData?.className}`;
      if (currentLayout === LayoutType.Grid) {
        return (
          <div className="w-full aspect-[1/1] grid grid-cols-1">
            <img src={finalImage} alt="Végső fotó" className={imgClasses} />
          </div>
        );
      } else { // Strip layout
         return (
          <div className="w-full aspect-[1/2] sm:aspect-[1/2] sm:h-[400px] md:h-[500px] flex justify-center items-center">
            <img src={finalImage} alt="Végső fotócsík" className={`max-w-full max-h-full object-contain ${activeFilterData?.className}`} />
          </div>
        );
      }
    }
    // Placeholder if no final image
    const placeholderClass = activeFilterData?.className || "filter grayscale";
    if (currentLayout === LayoutType.Grid) {
      return (
        <div className="w-full aspect-[1/1] grid grid-cols-2 gap-3">
            {PLACEHOLDER_PORTRAITS.map((src, index) => (
                <div key={index} className={`aspect-[1/1] bg-cover bg-center rounded-md ${placeholderClass}`} style={{backgroundImage: `url('${src}')`}}></div>
            ))}
        </div>
      );
    } else { // Photostrip placeholder
      return (
        <div className="w-full aspect-[1/2] sm:h-[400px] md:h-[500px] flex flex-col gap-2 p-2">
           {PLACEHOLDER_PORTRAITS.map((src, index) => (
                <div key={index} className={`h-1/4 w-full bg-cover bg-center rounded-md ${placeholderClass}`} style={{backgroundImage: `url('${src}')`}}></div>
            ))}
        </div>
      );
    }
  };

  return (
    <section id="gallery" className="relative py-16 sm:py-24 border-t-2 border-stone-200">
      <div className="absolute top-0 left-0 wow-number font-serif font-extrabold text-[15rem] sm:text-[20rem] text-stone-200/60 opacity-50 select-none">03</div>
      
      <div className="relative z-10 text-center">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">A Galéria</h2>
        <p className="text-lg text-stone-600 mb-12 max-w-2xl mx-auto">Elkészült a mű! Mentsd le, oszd meg, vagy készíts egy újat.</p>

        <div className="max-w-xl mx-auto bg-white rounded-2xl p-4 shadow-2xl">
          {renderFinalImage()}
          <div className="text-center border-t border-stone-200 pt-3 mt-4">
            <h3 className="font-serif text-xl tracking-tight">Photobooth Project</h3>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={handleFilteredDownload} 
            disabled={!finalImage || isLoading}
            className="w-full sm:w-auto bg-stone-900 hover:bg-stone-700 text-white font-bold py-4 px-8 rounded-full transition-colors text-base flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <DownloadIcon />Letöltés
          </button>
          <button 
            onClick={handleFilteredShare} 
            disabled={!finalImage || isLoading}
            className="w-full sm:w-auto bg-white border-2 border-stone-400 text-stone-900 font-bold py-4 px-8 rounded-full hover:bg-stone-100 hover:border-stone-900 transition-colors text-base flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShareIcon />Megosztás
          </button>
        </div>
        <div className="mt-8">
          <button 
            onClick={onNewPhotoshoot}
            className="text-stone-500 hover:text-red-600 font-medium transition-colors"
          >
            Új fotósorozat készítése
          </button>
        </div>
        {!finalImage && !isLoading && (
             <p className="text-center text-stone-500 mt-8">Fejezd be a fotózást és a stílusválasztást, hogy itt megjelenjen a végső kép!</p>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
