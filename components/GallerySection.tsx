
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

  const renderFinalImage = () => {
    if (isLoading) {
      return <div className="w-full aspect-square flex items-center justify-center bg-stone-100 rounded-md"><p className="text-stone-500">Kép generálása...</p></div>;
    }
    if (finalImage) {
      const imgClasses = `w-full h-full object-contain ${activeFilterData?.className}`;
      if (currentLayout === LayoutType.Grid) {
        return (
          <div className="w-full aspect-square grid grid-cols-1"> {/* Wrapper to contain single image properly */}
            <img src={finalImage} alt="Végső fotó" className={imgClasses} />
          </div>
        );
      } else { // Strip layout
         return (
          <div className="w-full aspect-[1/2] sm:aspect-auto sm:h-[400px] md:h-[500px] flex justify-center items-center"> {/* Adjust aspect ratio for strip */}
            <img src={finalImage} alt="Végső fotócsík" className={`max-w-full max-h-full object-contain ${activeFilterData?.className}`} />
          </div>
        );
      }
    }
    // Placeholder if no final image
    const placeholderClass = activeFilterData?.className || "filter grayscale";
    if (currentLayout === LayoutType.Grid) {
      return (
        <div className="w-full aspect-square grid grid-cols-2 gap-3">
            {PLACEHOLDER_PORTRAITS.map((src, index) => (
                <div key={index} className={`aspect-square bg-cover bg-center rounded-md ${placeholderClass}`} style={{backgroundImage: `url('${src}')`}}></div>
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
            onClick={onDownload} 
            disabled={!finalImage || isLoading}
            className="w-full sm:w-auto bg-stone-900 hover:bg-stone-700 text-white font-bold py-4 px-8 rounded-full transition-colors text-base flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <DownloadIcon />Letöltés
          </button>
          <button 
            onClick={onShare} 
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
