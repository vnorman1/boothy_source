import React from 'react';
import { LayoutType } from '../types';
import { COUNTDOWN_VALUES, LAYOUT_OPTIONS, PHOTOS_PER_SESSION_OPTIONS } from '../constants';
import { TakePhotoIcon, ModernCameraSwitchIcon, FlashIcon, GridIcon, StripIcon } from './icons';
import CameraView from './CameraView';

interface StudioSectionProps {
  selectedLayout: LayoutType;
  setSelectedLayout: (layout: LayoutType) => void;
  countdown: number;
  setCountdown: (seconds: number) => void;
  useFrontCamera: boolean;
  toggleCamera: () => void;
  isFlashOn: boolean; // Simulated
  toggleFlash: () => void; // Simulated
  startPhotoSession: () => void;
  isTakingPhoto: boolean;
  activeCountdown: number | null;
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isCameraActive: boolean;
  photoError: string | null;
  capturedIndividualPhotos: string[];
  photosPerSession: number;
  setPhotosPerSession: (n: number) => void;
}

const StudioSection: React.FC<StudioSectionProps> = ({
  selectedLayout, setSelectedLayout, countdown, setCountdown,
  useFrontCamera, toggleCamera, isFlashOn, toggleFlash,
  startPhotoSession, isTakingPhoto, activeCountdown,
  stream, videoRef, isCameraActive, photoError,
  capturedIndividualPhotos, photosPerSession, setPhotosPerSession
}) => {

  const getLayoutIcon = (layoutId: LayoutType) => {
    if (layoutId === LayoutType.Grid) return <GridIcon />;
    if (layoutId === LayoutType.Strip) return <StripIcon />;
    return null;
  };
  
  return (
    <section id="studio" className="relative py-16 sm:py-24 border-t-2 border-stone-200">
      <div className="absolute top-0 left-0 wow-number font-serif font-extrabold text-[15rem] sm:text-[20rem] text-stone-200/60 opacity-50 select-none">01</div>
      
      <div className="relative z-10">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">A Stúdió</h2>
        <p className="text-lg text-stone-600 mb-12">Komponáld meg a jelenetet, és indítsd a fotózást.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* KAMERA NÉZET */}
          <div className="w-full lg:sticky lg:top-12">
            <CameraView 
              stream={stream} 
              videoRef={videoRef} 
              isCameraActive={isCameraActive}
              isTakingPhoto={isTakingPhoto}
              countdown={activeCountdown}
              useFrontCamera={useFrontCamera}
              photoError={photoError}
            />
             {/* Captured photo thumbnails */}
            {capturedIndividualPhotos.length > 0 && (
                <div className="mt-4 p-2 bg-stone-100 rounded-lg">
                    <h4 className="text-sm font-medium text-stone-600 mb-2">Elkészült képek ({capturedIndividualPhotos.length}/{photosPerSession}):</h4>
                    <div className={`grid grid-cols-${Math.min(photosPerSession, 4)} gap-2`}>
                        {capturedIndividualPhotos.map((photoSrc, index) => (
                            <img key={index} src={photoSrc} alt={`Captured ${index + 1}`} className="w-full aspect-square object-cover rounded-md border-2 border-stone-300" />
                        ))}
                        {Array.from({ length: photosPerSession - capturedIndividualPhotos.length }).map((_, index) => (
                            <div key={`placeholder-${index}`} className="w-full aspect-square bg-stone-200 rounded-md"></div>
                        ))}
                    </div>
                </div>
            )}
          </div>
          
          {/* VEZÉRLŐPULT */}
          <div className="flex flex-col gap-12">
            {/* Elrendezés */}
            <div>
              <h3 className="font-bold text-xl mb-4">Elrendezés</h3>
              <div className="grid grid-cols-2 gap-4">
                {LAYOUT_OPTIONS.map(layout => (
                  <div 
                    key={layout.id}
                    onClick={() => !isTakingPhoto && setSelectedLayout(layout.id)}
                    className={`cursor-pointer group p-2 rounded-lg ring-2 bg-white hover:bg-white/80 transition-all duration-300 ${selectedLayout === layout.id ? 'ring-red-600' : 'ring-transparent hover:ring-red-600/50'}`}
                  >
                    {getLayoutIcon(layout.id)}
                    <p className={`text-center font-medium mt-2 text-sm ${selectedLayout === layout.id ? 'text-stone-900' : 'text-stone-600 group-hover:text-stone-900'}`}>{layout.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Beállítások */}
            <div id="studio-settings">
              <h3 className="font-bold text-xl mb-5">Beállítások</h3>
              <div className="space-y-6 p-6 bg-white/70 rounded-xl border border-stone-200">
                <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="font-medium text-stone-700">Képek száma:</label>
                  <div className="flex items-center gap-1 bg-stone-200 p-1 rounded-full self-start sm:self-center">
                    {PHOTOS_PER_SESSION_OPTIONS.map(val => (
                      <button
                        key={val}
                        onClick={() => !isTakingPhoto && (selectedLayout === LayoutType.Strip || val === 4) && setPhotosPerSession(val)}
                        className={`px-4 py-1 text-sm font-semibold rounded-full transition ${photosPerSession === val ? 'bg-stone-900 text-white' : 'hover:bg-white/80'} ${selectedLayout === LayoutType.Grid && val !== 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isTakingPhoto || (selectedLayout === LayoutType.Grid && val !== 4)}
                      >
                        {val} kép
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="font-medium text-stone-700">Visszaszámláló:</label>
                  <div className="flex items-center gap-1 bg-stone-200 p-1 rounded-full self-start sm:self-center">
                    {COUNTDOWN_VALUES.map(val => (
                      <button 
                        key={val}
                        onClick={() => !isTakingPhoto && setCountdown(val)}
                        className={`px-4 py-1 text-sm font-semibold rounded-full transition ${countdown === val ? 'bg-stone-900 text-white' : 'hover:bg-white/80'}`}
                      >
                        {val}s
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="font-medium text-stone-700">Eszközök:</label>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button 
                      title="Kamera váltás" 
                      onClick={toggleCamera}
                      disabled={isTakingPhoto}
                      className={`p-3 rounded-full hover:bg-stone-300 transition ${useFrontCamera ? 'bg-red-200 hover:bg-red-300' : 'bg-stone-200'}`}
                    >
                      <ModernCameraSwitchIcon className="h-5 w-5" />
                    </button>
                    <button 
                      title="Vaku be/ki (szimulált)" 
                      onClick={toggleFlash}
                      disabled={isTakingPhoto}
                      className={`p-3 rounded-full hover:bg-stone-300 transition ${isFlashOn ? 'bg-yellow-300 hover:bg-yellow-400' : 'bg-stone-200'}`}
                    >
                      <FlashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Fő Akciógomb */}
            <a
              href="#studio"
              onClick={e => {
                e.preventDefault();
                document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
                if (!isTakingPhoto && isCameraActive) startPhotoSession();
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-6 rounded-2xl transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 shadow-xl shadow-red-500/30 text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ pointerEvents: isTakingPhoto || !isCameraActive ? 'none' : 'auto', opacity: isTakingPhoto || !isCameraActive ? 0.5 : 1 }}
            >
              <TakePhotoIcon />
              <span>{isTakingPhoto ? 'Fotózás Folyamatban...' : 'Fotózás Indítása'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioSection;
