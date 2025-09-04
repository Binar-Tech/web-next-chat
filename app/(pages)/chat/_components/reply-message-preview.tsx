import { getFileType, getFileUrl } from "@/app/utils/file";
import { X } from "lucide-react";
import { MessageDto } from "../_actions/dtos/message-dto";
import { PerfilEnum } from "../_services/enums/perfil.enum";

type ReplyPreviewProps = {
  isCurrentUser: boolean;
  nomeLogado: string;
  message: MessageDto;
  onCancel: () => void;
};

export function ReplyMessagePreview({
  message,
  isCurrentUser,
  nomeLogado,
  onCancel,
}: ReplyPreviewProps) {
  const isMedia = message.nome_arquivo != null;

  const fileType = getFileType(message.nome_arquivo);

  function getDisplayName(): string {
    if (isCurrentUser) {
      if (message.remetente === PerfilEnum.TECNICO) {
        return message.tecnico_responsavel === nomeLogado
          ? "Você"
          : message.tecnico_responsavel;
      }
      return "Você";
    }

    return "Operador";
  }

  return (
    <div className="flex items-center justify-between p-2 mb-2 dark:bg-neutral-700 bg-slate-100 rounded-lg border-l-4 border-green-500 animate-slide-down">
      {/* Conteúdo à esquerda */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <span className="text-xs text-green-400">{getDisplayName()}</span>

        {isMedia ? (
          <span className="text-sm text-gray-300">
            {fileType === "imagem" && "📷 Foto"}
            {fileType === "video" && "🎥 Vídeo"}
            {fileType === "audio" && "🎵 Áudio"}
            {fileType === "youtube" && "▶️ YouTube"}
            {fileType === "file" && "📎 Arquivo"}
          </span>
        ) : (
          <span className="truncate max-w-xs text-gray-300">
            {message.mensagem}
          </span>
        )}
      </div>

      {/* Thumb à direita se for mídia */}
      {isMedia && (
        <div className="ml-2">
          {fileType === "imagem" ? (
            <img
              src={getFileUrl(message)}
              alt="preview"
              className="w-12 h-12 rounded object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded bg-neutral-700 flex items-center justify-center text-white text-lg">
              {fileType === "video" && "🎥"}
              {fileType === "audio" && "🎵"}
              {fileType === "youtube" && "▶️"}
              {fileType === "file" && "📎"}
            </div>
          )}
        </div>
      )}

      {/* Botão cancelar */}
      <button
        onClick={onCancel}
        className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}
