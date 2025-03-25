"use client";
import { getFileType } from "@/app/_utils/file";
import { FileText, Loader } from "lucide-react";
import { Button } from "../../../_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "../../../_components/ui/dialog";

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  imageUrl: string | null;
  isUploading?: boolean;
  fileName?: string;
}

export default function ImagePreviewModal({
  open,
  onClose,
  imageUrl,
  onConfirm,
  isUploading = false,
  fileName,
}: ImagePreviewModalProps) {
  const fileType = getFileType(fileName!);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-screen-md w-full max-h-[90vh] flex flex-col items-center justify-between p-4">
        <DialogTitle></DialogTitle>

        {imageUrl ? (
          <div className="flex justify-center items-center w-full max-h-[70vh] overflow-hidden">
            {fileType === "imagem" ? (
              <img
                src={imageUrl}
                alt="Imagem Selecionada"
                className="max-w-full max-h-[50vh] object-contain rounded-lg"
              />
            ) : fileType === "video" ? (
              <video
                src={imageUrl}
                controls
                className="max-w-full max-h-[50vh] object-contain rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center">
                <FileText className="w-16 h-16 text-gray-500" />
                <p className="text-gray-700 text-center mt-2">{fileName}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            Nenhum arquivo selecionado.
          </p>
        )}

        <DialogFooter className="w-full flex justify-center py-2 gap-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={onConfirm}>
            {isUploading ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              "Confirmar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
