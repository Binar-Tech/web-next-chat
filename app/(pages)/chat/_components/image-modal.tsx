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
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API_FILES;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-none p-0 flex items-center justify-center ">
        <DialogTitle className="hidden" /> {/* Oculta o título */}
        {imageUrl ? (
          <img
            src={`${fileBaseUrl}?path=${imageUrl}`}
            alt="Imagem Selecionada"
            className="max-w-full max-h-full rounded-lg"
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
