'use client';

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Big main photo with small photos below it.
// Click a small photo (or the arrows) to change the big one.
interface CarGalleryProps {
  images: string[];
  title: string;
}

const CarGallery = ({ images, title }: CarGalleryProps) => {
  // `current` remembers which photo is showing (0 = the first one)
  const [current, setCurrent] = useState(0);

  const showPrevious = () =>
    setCurrent((current - 1 + images.length) % images.length);
  const showNext = () => setCurrent((current + 1) % images.length);

  return (
    <div className="space-y-3">
      {/* Main photo */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted">
        <Image
          src={images[current]}
          alt={`${title} photo ${current + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover"
        />

        {/* Arrows and counter only show when there is more than one photo */}
        {images.length > 1 && (
          <>
            <button
              onClick={showPrevious}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition hover:bg-primary"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={showNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition hover:bg-primary"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground">
              {current + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Small photos below */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={image}
              onClick={() => setCurrent(index)}
              aria-label={`Show photo ${index + 1}`}
              className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition ${
                index === current
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={image} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarGallery;