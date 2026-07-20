import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, Maximize2 } from 'lucide-react';
import { Skeleton } from '../../ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '../../ui/carousel';
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

export function ProductGallery({
  activeImage,
  name,
  isFav,
  allImages,
  onToggleWishlist,
  onImageSelect
}: ProductGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { language } = useAppStore();

  // States for desktop zoom magnifier
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  // Sync internal state with external activeImage changes (if any)
  useEffect(() => {
    const idx = allImages.findIndex(img => img === activeImage);
    if (idx !== -1 && idx !== selectedIndex && api) {
      api.scrollTo(idx);
    }
  }, [activeImage, allImages, api, selectedIndex]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const idx = api.selectedScrollSnap();
      setSelectedIndex(idx);
      if (allImages[idx]) {
        onImageSelect(allImages[idx]);
      }
    };

    api.on("select", onSelect);
    // Initial sync
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api, allImages, onImageSelect]);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const imagesToRender = allImages && allImages.length > 0 ? allImages : (activeImage ? [activeImage] : ['/images/placeholder.png']);

  return (
    <div className="lg:w-1/2 relative flex flex-col gap-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Main Image Carousel */}
      <Carousel setApi={setApi} className="w-full" opts={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
        <CarouselContent>
          {imagesToRender.map((img, idx) => (
            <CarouselItem key={idx}>
              <Dialog>
                <div
                  className="aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-[#EAE5DF] relative group cursor-zoom-in"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    ref={imgRef}
                    src={img}
                    alt={`${name} - Image ${idx + 1}`}
                    className={`w-full h-full object-contain transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
                  />

                  {/* Magnified Image for Desktop */}
                  {isHovering && (
                    <div
                      className="absolute inset-0 pointer-events-none hidden md:block bg-no-repeat"
                      style={{
                        backgroundImage: `url(${img})`,
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

                {/* Fullscreen Lightbox Modal */}
                <DialogContent className="max-w-screen-xl w-[95vw] h-[90vh] p-1 sm:p-6 bg-transparent border-none shadow-none flex flex-col justify-center outline-none">
                  <DialogTitle className="sr-only">{name} - Fullscreen Image</DialogTitle>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={img}
                      alt={`${name} - Fullscreen`}
                      className="max-w-full max-h-full object-contain rounded-xl"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Thumbnails */}
      {imagesToRender.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x no-scrollbar">
          {imagesToRender.map((img, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 overflow-hidden shrink-0 transition-all snap-start ${selectedIndex === index ? 'border-[#C5A880] scale-100 ring-2 ring-[#C5A880]/20' : 'border-transparent hover:border-gray-200 opacity-70 hover:opacity-100 scale-95'}`}
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
