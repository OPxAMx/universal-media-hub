import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryViewerProps {
  images: string[];
  title: string;
  onClose: () => void;
}

const GalleryViewer = ({ images, title, onClose }: GalleryViewerProps) => {
  const [index, setIndex] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md" onClick={onClose}>
      <div className="modal-cinematic w-full max-w-5xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-2xl font-bold text-foreground">{title}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{index + 1} / {images.length}</span>
            <button onClick={onClose} className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border">
          <img src={images[index]} alt={`${title} ${index + 1}`} className="w-full h-full object-cover" />
          {images.length > 1 && (
            <>
              <button onClick={() => setIndex((index - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/70 text-foreground hover:bg-background/90 backdrop-blur-sm transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={() => setIndex((index + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/70 text-foreground hover:bg-background/90 backdrop-blur-sm transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`flex-shrink-0 w-20 h-14 rounded overflow-hidden border-2 transition-colors ${i === index ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryViewer;
