
import React from 'react';

interface CameraViewProps {
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  isCameraActive: boolean;
  isTakingPhoto: boolean;
  countdown: number | null;
  useFrontCamera: boolean;
  photoError: string | null;
}

const CameraView: React.FC<CameraViewProps> = ({ stream, videoRef, isCameraActive, isTakingPhoto, countdown, useFrontCamera, photoError }) => {
  return (
    <div className="w-full aspect-square bg-black rounded-2xl flex items-center justify-center p-2 sm:p-8 shadow-2xl ring-4 ring-offset-8 ring-stone-900 ring-offset-stone-50 relative overflow-hidden">
      {isCameraActive && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted // Important for autoplay
          className={`w-full h-full object-cover rounded-xl ${useFrontCamera ? 'transform -scale-x-100' : ''}`}
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
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <p className="text-white font-bold text-9xl font-serif animate-ping">{countdown}</p>
        </div>
      )}
      {isTakingPhoto && countdown === 0 && (
         <div className="absolute inset-0 flex items-center justify-center bg-white animate-pulse">
          <p className="text-black font-bold text-6xl font-serif">CSÍÍÍZ!</p>
        </div>
      )}
    </div>
  );
};

export default CameraView;
