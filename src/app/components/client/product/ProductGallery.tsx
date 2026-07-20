import React, { useState, useEffect, useRef } from 'react';
import { Heart, Maximize2 } from 'lucide-react';
import { Skeleton } from '../../ui/skeleton';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '../../ui/dialog';
import { useAppStore } from '@/app/store/useAppStore';

interface ProductGalleryProps {
  activeImage: string;
  name: string;
  isFav: boolean;
  allImages: string[];
  onToggleWishlist: () => void;
  onImageSelect: (img: string) => void;
}

function drawImageContain(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number) {
  const ir = img.width / img.height;
  const cr = cw / ch;
  let dw, dh, dx, dy;
  if (ir > cr) {
    dw = cw;
    dh = cw / ir;
    dx = 0;
    dy = (ch - dh) / 2;
  } else {
    dh = ch;
    dw = ch * ir;
    dy = 0;
    dx = (cw - dw) / 2;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

export function ProductGallery({
  activeImage,
  name,
  isFav,
  allImages,
  onToggleWishlist,
  onImageSelect
}: ProductGalleryProps) {
  const { language } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const currentImageRef = useRef<string>('');

  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const imagesToRender = allImages && allImages.length > 0 ? allImages : (activeImage ? [activeImage] : ['/placeholder-food.jpg']);
  const [targetImage, setTargetImage] = useState(imagesToRender[0]);

  useEffect(() => {
    if (activeImage && imagesToRender.includes(activeImage)) {
      setTargetImage(activeImage);
    } else {
      setTargetImage(imagesToRender[0]);
    }
  }, [activeImage, imagesToRender]);

  // Preload and cache images
  useEffect(() => {
    imagesToRender.forEach(src => {
      if (!imageCache.current.has(src)) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        imageCache.current.set(src, img);
      }
    });
  }, [imagesToRender]);

  // Canvas drawing & crossfade animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width > 0 ? rect.width : 800;
      canvas.height = rect.height > 0 ? rect.height : 800;
    }

    const oldSrc = currentImageRef.current;
    const newSrc = targetImage;
    const imgOld = oldSrc ? imageCache.current.get(oldSrc) : null;
    const imgNew = imageCache.current.get(newSrc);

    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 300; 

    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (oldSrc !== newSrc && imgOld && imgOld.complete) {
        ctx.globalAlpha = 1 - progress;
        drawImageContain(ctx, imgOld, canvas.width, canvas.height);
      }

      if (imgNew && imgNew.complete) {
        ctx.globalAlpha = oldSrc === newSrc ? 1 : progress;
        drawImageContain(ctx, imgNew, canvas.width, canvas.height);
      }

      ctx.globalAlpha = 1.0;

      if (progress < 1 && oldSrc !== newSrc) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        currentImageRef.current = newSrc;
      }
    };

    if (oldSrc !== newSrc) {
      if (imgNew && !imgNew.complete) {
        imgNew.onload = () => {
          animationFrameId = requestAnimationFrame(render);
        };
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    } else {
      if (imgNew && imgNew.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawImageContain(ctx, imgNew, canvas.width, canvas.height);
      } else if (imgNew) {
        imgNew.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawImageContain(ctx, imgNew, canvas.width, canvas.height);
        }
      }
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [targetImage]);

  useEffect(() => {
    const handleResize = () => {
       const canvas = canvasRef.current;
       if (!canvas) return;
       const rect = canvas.getBoundingClientRect();
       canvas.width = rect.width;
       canvas.height = rect.height;
       
       const ctx = canvas.getContext('2d');
       if (!ctx) return;
       const currentImg = imageCache.current.get(targetImage);
       if (currentImg && currentImg.complete) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawImageContain(ctx, currentImg, canvas.width, canvas.height);
       }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [targetImage]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="lg:w-1/2 relative flex flex-col gap-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Dialog>
        <div
          ref={containerRef}
          className="aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-[#EAE5DF] relative group cursor-zoom-in"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
        >
          <canvas
            ref={canvasRef}
            className={`w-full h-full transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
          />

          {isHovering && (
            <div
              className="absolute inset-0 pointer-events-none hidden md:block bg-no-repeat"
              style={{
                backgroundImage: `url(${targetImage})`,
                backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                backgroundSize: '200%',
              }}
            />
          )}

          <DialogTrigger asChild>
            <button className="absolute bottom-4 start-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-gray-700 hover:text-black hover:bg-white transition-all z-20 md:hidden">
              <Maximize2 size={18} />
            </button>
          </DialogTrigger>

          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleWishlist(); }}
            className={`absolute top-4 end-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center transition-all z-20 ${isFav ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-white'}`}
          >
            <Heart size={22} fill={isFav ? "currentColor" : "none"} />
          </button>
        </div>

        <DialogContent className="max-w-screen-xl w-[95vw] h-[90vh] p-1 sm:p-6 bg-transparent border-none shadow-none flex flex-col justify-center outline-none">
          <DialogTitle className="sr-only">{name} - Fullscreen Image</DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={targetImage}
              alt={`${name} - Fullscreen`}
              className="max-w-full max-h-full object-contain rounded-xl"
            />
          </div>
        </DialogContent>
      </Dialog>

      {imagesToRender.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x no-scrollbar">
          {imagesToRender.map((img, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(img)}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 overflow-hidden shrink-0 transition-all snap-start ${targetImage === img ? 'border-[#C5A880] scale-100 ring-2 ring-[#C5A880]/20' : 'border-transparent hover:border-gray-200 opacity-70 hover:opacity-100 scale-95'}`}
            >
              <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductGallerySkeleton() {
  return (
    <div className="lg:w-1/2 relative flex flex-col gap-4">
      <Skeleton className="aspect-[4/3] sm:aspect-square rounded-2xl w-full h-full" />
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl shrink-0" />
        ))}
      </div>
    </div>
  );
}
