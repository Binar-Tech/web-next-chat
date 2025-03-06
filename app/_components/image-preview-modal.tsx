import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

export default function ImagePreviewModal({
  open,
  onClose,
  imageUrl,
}: ImagePreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>Pré-visualização da Imagem</DialogHeader>
        <DialogTitle></DialogTitle>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Imagem Selecionada"
            className="w-full rounded-lg"
          />
        ) : (
          <p className="text-gray-500 text-center">
            Nenhuma imagem selecionada.
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={() => alert("Imagem enviada!")}>
            Confirmar Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
