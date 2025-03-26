import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../_components/ui/dialog";

interface ImagePreviewModalProps {
  open: boolean;
}

export default function ModalDragdrop({ open }: ImagePreviewModalProps) {
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API_FILES;
  return (
    <Dialog open={open}>
      <DialogContent className="w-screen h-screen max-w-none p-0 flex items-center justify-center ">
        <DialogTitle className="hidden" /> {/* Oculta o título */}
        <div className="text-4xl">Arraste seu arquivo aqui...</div>
      </DialogContent>
    </Dialog>
  );
}
