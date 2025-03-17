import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../_components/ui/dialog";

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

export default function ImageModal({
  open,
  onClose,
  imageUrl,
}: ImagePreviewModalProps) {
  const fileBaseUrl = "http://localhost:4000/files/images";
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle></DialogTitle>
        {imageUrl ? (
          <img
            src={`${fileBaseUrl}?path=${imageUrl}`}
            alt="Imagem Selecionada"
            className="w-full rounded-lg"
          />
        ) : (
          <p className="text-gray-500 text-center">
            Nenhuma imagem selecionada.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
