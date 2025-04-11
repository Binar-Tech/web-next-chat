import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog";

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ModalAvaliation({
  open,
  onClose,
}: ImagePreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-none p-0 flex items-center justify-center ">
        <DialogTitle className="hidden" /> {/* Oculta o título */}
        <p>TESTE DE MODAL</p>
      </DialogContent>
    </Dialog>
  );
}
