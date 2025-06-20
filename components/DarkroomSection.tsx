import React from 'react';
import { FilterType } from '../types';
import { FILTER_OPTIONS, PLACEHOLDER_PORTRAITS } from '../constants';

interface DarkroomSectionProps {
  composedImage: string | null;
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  isLoading: boolean;
  currentLayoutRendersGrid: boolean; // to determine placeholder layout
}

const DarkroomSection: React.FC<DarkroomSectionProps> = ({ 
    composedImage, selectedFilter, setSelectedFilter, isLoading, currentLayoutRendersGrid 
}) => {
  const activeFilterData = FILTER_OPTIONS.find(f => f.id === selectedFilter);

  const renderPreviewContent = () => {
    if (isLoading) {
      return <div className="w-full h-full flex items-center justify-center bg-stone-100 rounded-md"><p className="text-stone-500">Képfeldolgozás...</p></div>;
    }
    if (composedImage) {
      return <img src={composedImage} alt="Elkészült fotósorozat" className={`w-full h-full object-contain aspect-[1/1] ${activeFilterData?.className}`} />;
    }
    // Placeholder rendering based on layout type
    if (currentLayoutRendersGrid) {
        return (
            <div className="w-full h-full grid grid-cols-2 gap-2">
                {PLACEHOLDER_PORTRAITS.map((src, index) => (
                    <div key={index} className="aspect-[1/1] bg-cover bg-center rounded-md filter grayscale" style={{backgroundImage: `url('${src}')`}}></div>
                ))}
            </div>
        );
    } else { // Photostrip placeholder (vertical)
        return (
            <div className="w-full h-full flex flex-col gap-2">
                {PLACEHOLDER_PORTRAITS.map((src, index) => (
                     <div key={index} className="h-1/4 w-full bg-cover bg-center rounded-md filter grayscale" style={{backgroundImage: `url('${src}')`}}></div>
                ))}
            </div>
        );
    }
  };


  return (
    <section id="darkroom" className="relative py-16 sm:py-24 border-t-2 border-stone-200">
      <div className="absolute top-0 right-0 wow-number font-serif font-extrabold text-[15rem] sm:text-[20rem] text-stone-200/60 opacity-50 text-right select-none">02</div>
      
      <div className="relative z-10">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">A Sötétkamra</h2>
        <p className="text-lg text-stone-600 mb-12">Találd meg a tökéletes hangulatot a fotóidhoz.</p>
        
        <div className="w-full bg-white rounded-2xl shadow-xl border border-stone-200 p-6 sm:p-10 flex flex-col md:flex-row gap-8 sm:gap-12 items-center">
          {/* ELŐNÉZET */}
          <div className="w-full md:w-1/2 aspect-square bg-white rounded-xl p-3 shadow-inner">
            {renderPreviewContent()}
          </div>
          
          {/* STÍLUS VÁLASZTÓ */}
          <div className="w-full md:w-1/2">
            <h3 className="font-bold text-xl mb-6">Válassz stílust:</h3>
            <div className="grid grid-cols-2 gap-4">
              {FILTER_OPTIONS.map(filter => (
                <div 
                  key={filter.id}
                  onClick={() => !isLoading && setSelectedFilter(filter.id)}
                  className="cursor-pointer group"
                >
                  <img 
                    src={composedImage || PLACEHOLDER_PORTRAITS[0]} // Use first placeholder if no composed image
                    alt={filter.name} 
                    className={`w-full aspect-square object-cover rounded-lg ring-2 transition ${filter.className} ${selectedFilter === filter.id ? 'ring-orange-600' : 'ring-transparent group-hover:ring-orange-600/50'}`} 
                  />
                  <p className={`font-medium text-sm mt-2 text-center ${selectedFilter === filter.id ? 'text-stone-900' : 'text-stone-600 group-hover:text-stone-900'}`}>{filter.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {!composedImage && !isLoading && (
            <p className="text-center text-stone-500 mt-8">Készíts fotókat a Stúdióban, hogy itt megjelenjenek!</p>
        )}
      </div>
    </section>
  );
};

export default DarkroomSection;
