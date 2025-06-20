import React, { useEffect } from 'react';

interface CameraViewProps {
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isCameraActive: boolean;
  isTakingPhoto: boolean;
  countdown: number | null;
  useFrontCamera: boolean;
  photoError: string | null;
  onRequestCameraStart?: () => void;
  onRequestCameraStop?: () => void;
  cameraPermissionRequested: boolean;
  setCameraPermissionRequested: (v: boolean) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ stream, videoRef, isCameraActive, isTakingPhoto, countdown, useFrontCamera, photoError, onRequestCameraStart, onRequestCameraStop, cameraPermissionRequested, setCameraPermissionRequested }) => {

  useEffect(() => {
    // Az IntersectionObserver logikát eltávolítjuk innen, mert már a StudioSection figyeli a láthatóságot
  }, [onRequestCameraStart, onRequestCameraStop]);

  if (!cameraPermissionRequested) {
    return (
      <div className="w-full aspect-[1/1] bg-black rounded-2xl flex items-center justify-center p-2 sm:p-8 shadow-2xl ring-4 ring-offset-4 ring-stone-900 ring-offset-stone-50 relative overflow-hidden">
        <button
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-4 rounded-3xl text-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-300"
          onClick={() => setCameraPermissionRequested(true)}
        >
          Kamera engedélyezése
        </button>
      </div>
    );
  }

  return (
    <div className="w-full aspect-[1/1] bg-black rounded-2xl flex items-center justify-center p-2 sm:p-8 shadow-2xl ring-4 ring-offset-4 ring-stone-900 ring-offset-stone-50 relative overflow-hidden">
      {isCameraActive && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted // Important for autoplay
          className={`w-full h-full object-cover rounded-xl ${useFrontCamera ? 'scale-x-[-1]' : ''}`}
          onLoadedMetadata={() => {
            // Ensure video starts playing once metadata is loaded
            if (videoRef.current) {
              videoRef.current.play().catch(err => {
                console.error("Error starting video playback:", err);
              });
            }
          }}
        />
      ) : (
        <div className="text-center">
          <p className="text-stone-400 text-lg">
            {photoError ? "Hiba" : isTakingPhoto ? "Fotózás..." : "-- Kamera Élőkép --"}
          </p>
          <p className="text-stone-600 text-sm mt-2">
            {photoError ? photoError : isTakingPhoto ? "Készülj!" : "Itt fogod látni magad."}
          </p>
          {!photoError && !isCameraActive && !isTakingPhoto && (
             <p className="text-stone-500 text-xs mt-4">Engedélyezd a kamerát a böngésződben.</p>
          )}
        </div>
      )}
      {isTakingPhoto && countdown !== null && countdown > 0 && (
        <div className="absolute inset-0 flex items-center justify-center" style={{background: 'rgba(0,0,0,0.5)'}}>
          <p className="text-white font-bold text-7xl font-serif animate-none" style={{letterSpacing: '0.05em'}}>{countdown}</p>
        </div>
      )}
      {isTakingPhoto && countdown === 0 && (
         <div className="absolute inset-0 flex items-center justify-center" style={{background: 'rgba(255,255,255,0.92)'}}>
          <p className="text-black font-bold text-5xl font-serif" style={{letterSpacing: '0.1em'}}>CSÍÍÍZ!</p>
        </div>
      )}
    </div>
  );
};

export default CameraView;
