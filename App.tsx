import React, { useState, useEffect, useRef } from 'react';
import { LayoutType, FilterType } from './types';
import { COUNTDOWN_VALUES, FILTER_OPTIONS, PHOTOS_PER_SESSION_OPTIONS } from './constants';
import HeroSection from './components/HeroSection';
import StudioSection from './components/StudioSection';
import DarkroomSection from './components/DarkroomSection';
import GallerySection from './components/GallerySection';
import FooterSection from './components/FooterSection';
import DarkroomGif from './components/Darkroom_gif'; // Import the GIF component
import NavSide from './components/nav-side'; // Import the side navigation component

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
  const [photosPerSession, setPhotosPerSession] = useState<number>(4);
  const [cameraPermissionRequested, setCameraPermissionRequested] = useState(false);

  // Ref a fotózás állapotához, hogy az async ciklusban mindig naprakész legyen
  const isTakingPhotoRef = useRef(isTakingPhoto);
  useEffect(() => { isTakingPhotoRef.current = isTakingPhoto; }, [isTakingPhoto]);

  // Új: Kamera indítás/leállítás függvények
  const startCamera = async () => {
    if (!cameraPermissionRequested) return;
    if (stream) return; // Már fut
    try {
      setPhotoError(null);
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: useFrontCamera ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setStream(newStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play().catch(err => {
          console.error("Error playing video:", err);
        });
      }
    } catch (err) {
      setPhotoError("Kamera nem elérhető. Engedélyezd a böngésződben!");
      setIsCameraActive(false);
      setStream(null);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  // Mindig állítsuk be a video elem srcObject-ját, ha a stream vagy a ref változik
  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
      }
    }
  }, [stream, videoRef]);

  const toggleCamera = () => {
    if (isTakingPhoto) return;
    setUseFrontCamera(prev => !prev);
  };

  const toggleFlash = () => { // Simulated
    if (isTakingPhoto) return;
    setIsFlashOn(prev => !prev);
  };

  const captureFrame = (): string | null => {
    if (videoRef.current && captureCanvasRef.current && isCameraActive && videoRef.current.readyState >= videoRef.current.HAVE_METADATA) {
      const video = videoRef.current;
      const canvas = captureCanvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (useFrontCamera) { // Flip horizontal for front camera preview consistency
          ctx.save(); // Save context state
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.restore(); // Restore context state
        } else {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
        return canvas.toDataURL('image/jpeg', 0.9);
      }
    }
    return null;
  };

  const startPhotoSession = async () => {
    if (!isCameraActive || isTakingPhotoRef.current || !stream) {
      if (!stream || !isCameraActive) setPhotoError("Kamera nem aktív. Próbáld újraindítani.");
      return;
    }
    setIsTakingPhoto(true);
    setCapturedIndividualPhotos([]);
    setComposedImage(null); 
    setPhotoError(null);

    const photos: string[] = [];
    for (let i = 0; i < photosPerSession; i++) {
      setActiveCountdown(countdownDuration);
      for (let s = countdownDuration; s > 0; s--) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!isTakingPhotoRef.current) return; // Session aborted
        setActiveCountdown(s - 1);
      }
      // Flash effect
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
        await new Promise(resolve => setTimeout(resolve, 100)); 
        document.body.removeChild(overlay);
        await new Promise(resolve => setTimeout(resolve, 50)); 
      } else {
        await new Promise(resolve => setTimeout(resolve, 150)); 
      }
      // Próbáljuk többször a captureFrame-et, ha elsőre nem sikerül
      let photoDataUrl: string | null = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        photoDataUrl = captureFrame();
        if (photoDataUrl) break;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (photoDataUrl) {
        photos.push(photoDataUrl);
        setCapturedIndividualPhotos(prev => [...prev, photoDataUrl]);
      } else {
        setPhotoError("Nem sikerült képet készíteni.");
        setIsTakingPhoto(false);
        setActiveCountdown(null);
        return;
      }
      if (i < photosPerSession - 1) {
         await new Promise(resolve => setTimeout(resolve, 1000)); 
      }
    }
    setIsTakingPhoto(false); // Done with capturing individual photos
    setActiveCountdown(null);
    if (photos.length === photosPerSession) {
      composeFinalImage(photos, selectedLayout);
    }
  };

  const composeFinalImage = async (photos: string[], layout: LayoutType) => {
    setIsComposing(true);
    setPhotoError(null); 
    const canvas = compositionCanvasRef.current;
    if (!canvas) {
      setPhotoError("Belső hiba: A vászon nem elérhető.");
      setIsComposing(false);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setPhotoError("Belső hiba: A vászon kontextus nem elérhető.");
      setIsComposing(false);
      return;
    }

    const PADDING = 20;
    const IMAGE_SIZE = 400; // Base size for grid cells (IMAGE_SIZE x IMAGE_SIZE) and strip width

    const imagePromises = photos.map(photoSrc => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (e) => {
                console.error(`Failed to load image: ${photoSrc}`, e);
                reject(new Error(`Kép betöltése sikertelen: ${photoSrc.substring(0,30)}...`));
            }
            img.src = photoSrc;
        });
    });

    try {
        const loadedImages = await Promise.all(imagePromises);

        if (layout === LayoutType.Grid) {
            canvas.width = IMAGE_SIZE * 2 + PADDING * 3;
            canvas.height = IMAGE_SIZE * 2 + PADDING * 3;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            loadedImages.forEach((img, index) => {
                const row = Math.floor(index / 2);
                const col = index % 2;
                
                const sourceAspectRatio = img.naturalWidth / img.naturalHeight;
                const targetAspectRatio = 1; // Square cells
                
                let sourceX = 0, sourceY = 0, sourceWidth = img.naturalWidth, sourceHeight = img.naturalHeight;
                
                // Crop the source image to fit the target aspect ratio without stretching
                if (sourceAspectRatio > targetAspectRatio) {
                    // Source is wider - crop horizontally
                    sourceWidth = img.naturalHeight * targetAspectRatio;
                    sourceX = (img.naturalWidth - sourceWidth) / 2;
                } else if (sourceAspectRatio < targetAspectRatio) {
                    // Source is taller - crop vertically  
                    sourceHeight = img.naturalWidth / targetAspectRatio;
                    sourceY = (img.naturalHeight - sourceHeight) / 2;
                }
                
                const destX = PADDING + col * (IMAGE_SIZE + PADDING);
                const destY = PADDING + row * (IMAGE_SIZE + PADDING);
                
                ctx.drawImage(
                    img, 
                    sourceX, sourceY, sourceWidth, sourceHeight,  // Source rectangle
                    destX, destY, IMAGE_SIZE, IMAGE_SIZE           // Destination rectangle
                );
            });
        } else { // LayoutType.Strip (vertical)
            const TARGET_STRIP_IMAGE_WIDTH = IMAGE_SIZE;
            
            // Calculate dimensions while maintaining aspect ratios
            let totalScaledHeight = 0;
            const scaledDimensions = loadedImages.map(img => {
                const aspectRatio = img.naturalHeight / img.naturalWidth;
                const scaledHeight = aspectRatio * TARGET_STRIP_IMAGE_WIDTH;
                totalScaledHeight += scaledHeight;
                return { img, scaledHeight, aspectRatio };
            });

            canvas.width = TARGET_STRIP_IMAGE_WIDTH + PADDING * 2;
            canvas.height = totalScaledHeight + (loadedImages.length + 1) * PADDING; 
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            let currentYOffset = PADDING;
            scaledDimensions.forEach(({ img, scaledHeight }) => {
                // Draw the image maintaining its aspect ratio
                ctx.drawImage(
                    img,
                    0, 0, img.naturalWidth, img.naturalHeight,     // Source: full image
                    PADDING, currentYOffset, TARGET_STRIP_IMAGE_WIDTH, scaledHeight  // Destination: scaled to fit width
                );
                currentYOffset += scaledHeight + PADDING;
            });
        }
        
        const composedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setComposedImage(composedDataUrl);
        // Scroll after state update ensures DarkroomSection has the new image
        requestAnimationFrame(() => { // Ensure DOM is updated before scrolling
             document.getElementById('darkroom')?.scrollIntoView({ behavior: 'smooth' });
        });


    } catch (error: any) {
        console.error("Error during image composition:", error);
        setPhotoError(error.message || "Hiba a képek összeállítása közben.");
        setComposedImage(null); 
    } finally {
        setIsComposing(false);
    }
  };
  
  const handleDownload = () => {
    if (!composedImage || !compositionCanvasRef.current) return;

    const originalCanvas = compositionCanvasRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = originalCanvas.width;
    tempCanvas.height = originalCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) return;

    const img = new window.Image();
    img.onload = () => {
      // Mindig explicit filter stringet állítunk be
      let filterString = 'none';
      if (selectedFilter === FilterType.BlackAndWhite) filterString = 'grayscale(1)';
      else if (selectedFilter === FilterType.Sepia) filterString = 'sepia(1)';
      else if (selectedFilter === FilterType.Vintage) filterString = 'sepia(0.6) contrast(1.1) brightness(0.9) saturate(1.2)';
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.filter = filterString;
      tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.filter = 'none';
      const link = document.createElement('a');
      link.href = tempCanvas.toDataURL('image/jpeg', 0.95);
      link.download = `photobooth_image_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.crossOrigin = 'anonymous';
    img.src = composedImage;
  };

  const handleShare = async () => {
    if (!composedImage || !compositionCanvasRef.current) return;
    
    const originalCanvas = compositionCanvasRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = originalCanvas.width;
    tempCanvas.height = originalCanvas.height;
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
            if ((error as Error).name !== 'AbortError') { // Don't alert if user simply cancelled share dialog
                alert("Megosztás nem sikerült vagy megszakították.");
            }
        }
    };
    img.src = composedImage;
  };

  const handleNewPhotoshoot = () => {
    setCapturedIndividualPhotos([]);
    setComposedImage(null);
    setSelectedFilter(FilterType.Original);
    setIsTakingPhoto(false); // Ensure photo taking state is reset
    setActiveCountdown(null);
    setPhotoError(null);
    setIsComposing(false);
    
    if (!isCameraActive) {
      // setCameraRestartKey(key => key + 1); // Eltávolítva, már nem kell újraindítani kulccsal
    }
    // Smooth scroll to studio section
    requestAnimationFrame(() => {
        document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  // Effect to re-evaluate selectedLayout for composition if individual photos change
  // This is useful if layout is changed *after* photos are taken but *before* darkroom
  // However, current flow: take photos -> compose -> then darkroom. So compose uses current layout.
  // If layout changes when `composedImage` exists, we might want to re-compose.
  // For now, composition happens once after taking photos.
  // To re-compose on layout change:
  /*
  useEffect(() => {
    if (capturedIndividualPhotos.length === PHOTOS_PER_SESSION && !isTakingPhoto) {
      composeFinalImage(capturedIndividualPhotos, selectedLayout);
    }
  }, [selectedLayout, capturedIndividualPhotos, isTakingPhoto]); // Careful with deps
  */
  // This might be too aggressive. Let's stick to composing once after capture.
  // User can restart if they want different layout with same subjects.

  // Csak strip layoutnál engedjük a 4/6/8 választást, gridnél fixen 4
  useEffect(() => {
    if (selectedLayout === LayoutType.Grid && photosPerSession !== 4) {
      setPhotosPerSession(4);
    }
  }, [selectedLayout]);

  // Ha a felhasználó engedélyezi a kamerát, azonnal próbáljuk indítani
  useEffect(() => {
    if (cameraPermissionRequested) {
      startCamera();
    }
    // csak cameraPermissionRequested változásra
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraPermissionRequested]);

  return (
    <div className="bg-stone-50 min-h-screen">
      <NavSide />
      <HeroSection />
      <main className="container mx-auto max-w-5xl px-4">
        <StudioSection
          selectedLayout={selectedLayout}
          setSelectedLayout={(layout) => {
            if (composedImage) {
                 if(capturedIndividualPhotos.length === photosPerSession && !isTakingPhoto && !isComposing) {
                    composeFinalImage(capturedIndividualPhotos, layout);
                 }
            }
            setSelectedLayout(layout);
          }}
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
          photosPerSession={photosPerSession}
          setPhotosPerSession={setPhotosPerSession}
          onRequestCameraStart={startCamera}
          onRequestCameraStop={stopCamera}
          cameraPermissionRequested={cameraPermissionRequested}
          setCameraPermissionRequested={setCameraPermissionRequested}
        />
        <DarkroomSection
          composedImage={composedImage}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          isLoading={isComposing}
          currentLayoutRendersGrid={selectedLayout === LayoutType.Grid}
        />
<DarkroomGif photos={capturedIndividualPhotos} />
        <GallerySection
          finalImage={composedImage}
          selectedFilter={selectedFilter}
          onDownload={handleDownload}
          onShare={handleShare}
          onNewPhotoshoot={handleNewPhotoshoot}
          isLoading={isComposing}
          currentLayout={selectedLayout}
        />
      </main>
      <FooterSection />
      <canvas ref={captureCanvasRef} style={{ display: 'none' }}></canvas>
      <canvas ref={compositionCanvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default App;
