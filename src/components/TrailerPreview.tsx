import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Props {
  trailerKey: string | null;
  title?: string;
  onOpenChange: (open: boolean) => void;
}

const TrailerPreview = ({ trailerKey, title, onOpenChange }: Props) => {
  return (
    <Dialog open={!!trailerKey} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-primary/30">
        <DialogTitle className="sr-only">{title || "Bande-annonce"}</DialogTitle>
        {trailerKey && (
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title={title || "Trailer"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrailerPreview;
