
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LayoutType, FilterType, CapturedPhoto } from './types';
import { COUNTDOWN_VALUES, FILTER_OPTIONS, PHOTOS_PER_SESSION } from './constants';
import HeroSection from './components/HeroSection';
import StudioSection from './components/StudioSection';
import DarkroomSection from './components/DarkroomSection';
import GallerySection from './components/GallerySection';
import FooterSection from './components/FooterSection';

const App: React.FC = () => {
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>(LayoutType.Grid);
  const [countdownDuration, setCountdownDuration] = useState<number>(COUNTDOWN_VALUES[1]); // Default 5s
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);
  const [isFlashOn, setIsFlashOn] = useState<boolean>(false); // Simulated flash
  
  const [capturedIndividualPhotos, setCapturedIndividualPhotos] = useState<string[]>([]);
  const [composedImage, setComposedImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(FilterType.Original);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const compositionCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isTakingPhoto, setIsTakingPhoto] = useState<boolean>(false);
  const [activeCountdown, setActiveCountdown] = useState<number | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState<boolean>(false);

  // Start camera
  const startCamera = useCallback(async (front: boolean) => {
    try {
      setPhotoError(null);
      if (stream) { // Stop existing stream before starting a new one
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: front ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(newStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setPhotoError("Kamera nem elérhető. Engedélyezd a böngésződben!");
      setIsCameraActive(false);
      setStream(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]); // videoRef is stable, no need to include

  useEffect(() => {
    startCamera(useFrontCamera);
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useFrontCamera]); // Removed startCamera from deps to avoid loop with its own stream dep

  const toggleCamera = () => {
    if (isTakingPhoto) return;
    setUseFrontCamera(prev => !prev);
  };

  const toggleFlash = () => { // Simulated
    if (isTakingPhoto) return;
    setIsFlashOn(prev => !prev);
  };

  const captureFrame = (): string | null => {
    if (videoRef.current && captureCanvasRef.current && isCameraActive) {
      const video = videoRef.current;
      const canvas = captureCanvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (useFrontCamera) { // Flip horizontal for front camera
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.9);
      }
    }
    return null;
  };

  const startPhotoSession = async () => {
    if (!isCameraActive || isTakingPhoto) return;
    setIsTakingPhoto(true);
    setCapturedIndividualPhotos([]);
    setComposedImage(null); // Clear previous composed image
    setPhotoError(null);

    const photos: string[] = [];
    for (let i = 0; i < PHOTOS_PER_SESSION; i++) {
      setActiveCountdown(countdownDuration);
      for (let s = countdownDuration; s > 0; s--) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setActiveCountdown(s - 1);
      }
      
      // Simulate flash
      if (isFlashOn) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'white';
        overlay.style.zIndex = '9999';
        overlay.style.opacity = '0.8';
        document.body.appendChild(overlay);
        await new Promise(resolve => setTimeout(resolve, 100)); // Flash duration
        document.body.removeChild(overlay);
        await new Promise(resolve => setTimeout(resolve, 50)); // Short pause after flash
      } else {
        await new Promise(resolve => setTimeout(resolve, 150)); // Small delay for "shutter"
      }
      
      const photoDataUrl = captureFrame();
      if (photoDataUrl) {
        photos.push(photoDataUrl);
        setCapturedIndividualPhotos(prev => [...prev, photoDataUrl]);
      } else {
        setPhotoError("Nem sikerült képet készíteni.");
        setIsTakingPhoto(false);
        setActiveCountdown(null);
        return;
      }
      if (i < PHOTOS_PER_SESSION - 1) {
         await new Promise(resolve => setTimeout(resolve, 1000)); // Pause between photos
      }
    }
    
    setIsTakingPhoto(false);
    setActiveCountdown(null);
    if (photos.length === PHOTOS_PER_SESSION) {
      composeFinalImage(photos, selectedLayout);
    }
  };

  const composeFinalImage = (photos: string[], layout: LayoutType) => {
    setIsComposing(true);
    const canvas = compositionCanvasRef.current;
    if (!canvas) {
      setIsComposing(false);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsComposing(false);
      return;
    }

    const PADDING = 20; // Padding around images and canvas
    const IMAGE_SIZE = 400; // Assuming square images for simplicity in grid/strip

    if (layout === LayoutType.Grid) {
      canvas.width = IMAGE_SIZE * 2 + PADDING * 3;
      canvas.height = IMAGE_SIZE * 2 + PADDING * 3;
      ctx.fillStyle = "white"; // Background for the composition
      ctx.fillRect(0,0,canvas.width, canvas.height);

      photos.forEach((photoSrc, index) => {
        const img = new Image();
        img.onload = () => {
          const row = Math.floor(index / 2);
          const col = index % 2;
          ctx.drawImage(img, PADDING + col * (IMAGE_SIZE + PADDING), PADDING + row * (IMAGE_SIZE + PADDING), IMAGE_SIZE, IMAGE_SIZE);
          if (index === photos.length - 1) { // Last image loaded
            setComposedImage(canvas.toDataURL('image/jpeg', 0.9));
            setIsComposing(false);
            document.getElementById('darkroom')?.scrollIntoView({ behavior: 'smooth' });
          }
        };
        img.src = photoSrc;
      });
    } else { // LayoutType.Strip (vertical)
      canvas.width = IMAGE_SIZE + PADDING * 2;
      canvas.height = IMAGE_SIZE * 4 + PADDING * 5;
      ctx.fillStyle = "white";
      ctx.fillRect(0,0,canvas.width, canvas.height);

      photos.forEach((photoSrc, index) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, PADDING, PADDING + index * (IMAGE_SIZE + PADDING), IMAGE_SIZE, IMAGE_SIZE);
          if (index === photos.length - 1) {
            setComposedImage(canvas.toDataURL('image/jpeg', 0.9));
            setIsComposing(false);
            document.getElementById('darkroom')?.scrollIntoView({ behavior: 'smooth' });
          }
        };
        img.src = photoSrc;
      });
    }
  };
  
  const handleDownload = () => {
    if (!composedImage || !compositionCanvasRef.current) return;

    const canvas = compositionCanvasRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) return;
    
    const img = new Image();
    img.onload = () => {
        const filterData = FILTER_OPTIONS.find(f => f.id === selectedFilter);
        if (filterData && filterData.className) {
            // Extract actual filter values like 'grayscale(1)' from 'filter grayscale'
            const cssFilterValue = filterData.className.replace('filter ', '').split(' ').map(s => {
              if (s === 'grayscale') return 'grayscale(1)';
              if (s === 'sepia') return 'sepia(1)';
              // Add more mappings if 'vintage' or others have complex CSS
              if (s === 'vintage') return 'sepia(0.6) contrast(1.1) brightness(0.9) saturate(1.2)';
              return s;
            }).join(' ');
            tempCtx.filter = cssFilterValue;
        }
        tempCtx.drawImage(img, 0, 0);
        
        const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `photobooth_image_${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    img.src = composedImage;
  };

  const handleShare = async () => {
    if (!composedImage || !compositionCanvasRef.current) return;

    // Apply filter to a temporary canvas for sharing
    const canvas = compositionCanvasRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) {
      alert("Megosztás nem sikerült: Hiba a képfeldolgozásban.");
      return;
    }
    
    const img = new Image();
    img.onload = async () => {
        const filterData = FILTER_OPTIONS.find(f => f.id === selectedFilter);
        if (filterData && filterData.className) {
            const cssFilterValue = filterData.className.replace('filter ', '').split(' ').map(s => {
              if (s === 'grayscale') return 'grayscale(1)';
              if (s === 'sepia') return 'sepia(1)';
              if (s === 'vintage') return 'sepia(0.6) contrast(1.1) brightness(0.9) saturate(1.2)';
              return s;
            }).join(' ');
            tempCtx.filter = cssFilterValue;
        }
        tempCtx.drawImage(img, 0, 0);

        try {
            const blob = await new Promise<Blob | null>(resolve => tempCanvas.toBlob(resolve, 'image/jpeg', 0.95));
            if (blob && navigator.share) {
                await navigator.share({
                    files: [new File([blob], `photobooth_image_${Date.now()}.jpg`, { type: 'image/jpeg' })],
                    title: 'Photobooth Képem',
                    text: 'Nézd meg ezt a képet, amit a Photobooth appal csináltam!',
                });
            } else if (blob) {
                alert("A böngésződ nem támogatja a közvetlen megosztást. Próbáld meg letölteni és manuálisan megosztani.");
            } else {
                 alert("Megosztás nem sikerült: Hiba a képfájl létrehozásakor.");
            }
        } catch (error) {
            console.error('Error sharing:', error);
            alert("Megosztás nem sikerült vagy megszakították.");
        }
    };
    img.src = composedImage;
  };

  const handleNewPhotoshoot = () => {
    setCapturedIndividualPhotos([]);
    setComposedImage(null);
    setSelectedFilter(FilterType.Original);
    setIsTakingPhoto(false);
    setActiveCountdown(null);
    setPhotoError(null);
    setIsComposing(false);
    // Optionally restart camera if it was stopped or errored
    if (!isCameraActive) {
      startCamera(useFrontCamera);
    }
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      <HeroSection />
      <main className="container mx-auto max-w-5xl px-4">
        <StudioSection
          selectedLayout={selectedLayout}
          setSelectedLayout={setSelectedLayout}
          countdown={countdownDuration}
          setCountdown={setCountdownDuration}
          useFrontCamera={useFrontCamera}
          toggleCamera={toggleCamera}
          isFlashOn={isFlashOn}
          toggleFlash={toggleFlash}
          startPhotoSession={startPhotoSession}
          isTakingPhoto={isTakingPhoto}
          activeCountdown={activeCountdown}
          stream={stream}
          videoRef={videoRef}
          isCameraActive={isCameraActive}
          photoError={photoError}
          capturedIndividualPhotos={capturedIndividualPhotos}
        />
        <DarkroomSection
          composedImage={composedImage}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          isLoading={isComposing}
          currentLayoutRendersGrid={selectedLayout === LayoutType.Grid}
        />
        <GallerySection
          finalImage={composedImage} // Gallery displays the composed image, filter is via CSS class
          selectedFilter={selectedFilter}
          onDownload={handleDownload}
          onShare={handleShare}
          onNewPhotoshoot={handleNewPhotoshoot}
          isLoading={isComposing}
          currentLayout={selectedLayout}
        />
      </main>
      <FooterSection />
      {/* Hidden canvases for operations */}
      <canvas ref={captureCanvasRef} style={{ display: 'none' }}></canvas>
      <canvas ref={compositionCanvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default App;
