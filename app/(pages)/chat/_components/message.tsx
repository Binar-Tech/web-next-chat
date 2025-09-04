"use client";

import { formatDate } from "@/app/utils/data";
import { getFileType, getFileUrl } from "@/app/utils/file";
import clsx from "clsx";
import { useState } from "react";
import { ChamadosDto } from "../_actions/dtos/chamado.dto";
import { MessageDto } from "../_actions/dtos/message-dto";
import { PerfilEnum } from "../_services/enums/perfil.enum";
import ImageModal from "./image-modal";
import MessageActions from "./message-actions";
import MessageAudio from "./message-audio";
import MessageFile from "./message-file";
import MessageImage from "./message-image";
import MessageReplyActions, { MessageAction } from "./message-reply-actions";
import MessageText from "./message-text";
import MessageVideo from "./message-video";
import MessageHeader from "./message.header";

interface MessageProps {
  message: MessageDto;
  isCurrentUser: boolean;
  call: ChamadosDto;
  nomeLogado: string;
  isReply?: boolean;
  onCustomAction?: (flag: boolean) => void;
  onClickMessageActions?: (action: MessageAction, message: MessageDto) => void;
}

export default function Message({
  message,
  isCurrentUser,
  call,
  nomeLogado,
  onCustomAction,
  isReply = false,
  onClickMessageActions,
}: MessageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  // Base URL para buscar arquivos
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API_FILES;

  // Função para verificar se é um link do YouTube
  const isYouTubeLink = (url: string) => {
    return /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/.test(url);
  };

  // Função para obter o ID do vídeo do YouTube
  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  const getVideoUrl = () => {
    return `${fileBaseUrl}/videos?path=${message.caminho_arquivo_ftp}/${message.nome_arquivo}`;
  };

  // Tipo do arquivo baseado na extensão
  const fileType = getFileType(message.nome_arquivo);

  //verifica qual nome exibir no box da mensagem {voce, operador, ou tecnico}
  function getDisplayName(): string {
    if (isReply) {
      if (message.remetente === PerfilEnum.OPERADOR) {
        return call.nome_operador === nomeLogado ? "Você" : call.nome_operador;
      }
      return message.tecnico_responsavel === nomeLogado
        ? "Você"
        : message.tecnico_responsavel;
    }

    if (isCurrentUser) {
      if (message.remetente === PerfilEnum.TECNICO) {
        return message.tecnico_responsavel === nomeLogado
          ? "Você"
          : message.tecnico_responsavel;
      }
      return "Você";
    }

    return message.remetente === PerfilEnum.OPERADOR
      ? call.nome_operador
      : message.tecnico_responsavel;
  }

  // Estilo do box
  const messageBoxClasses = clsx(
    "max-w-xl min-w-60 p-2 rounded-lg",
    isReply
      ? isCurrentUser
        ? "bg-blue-600"
        : "bg-gray-300 dark:bg-neutral-700"
      : isCurrentUser
      ? "bg-blue-500"
      : "bg-gray-200 dark:bg-neutral-600"
  );

  // Renderizador de conteúdo
  function renderContent() {
    if (message.mensagem && !isYouTubeLink(message.mensagem)) {
      return (
        <MessageText
          text={message.mensagem}
          isReply={isReply}
          isCurrentUser={isCurrentUser}
        />
      );
    }

    if (message.mensagem && isYouTubeLink(message.mensagem)) {
      return (
        <iframe
          width="250"
          height="140"
          src={getYouTubeEmbedUrl(message.mensagem)}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg"
        />
      );
    }

    if (fileType === "imagem") {
      return (
        <MessageImage
          src={getFileUrl(message)}
          onClick={() => setModalOpen(true)}
        />
      );
    }

    if (fileType === "video") {
      return <MessageVideo src={getVideoUrl()} />;
    }

    if (fileType === "arquivo" || fileType === "other") {
      return (
        <MessageFile
          src={getFileUrl(message)}
          filename={message.nome_arquivo}
        />
      );
    }

    if (fileType === "audio") {
      return <MessageAudio src={getFileUrl(message)} />;
    }

    return null;
  }

  // Mensagem do sistema
  if (message.system_message) {
    return (
      <div className="flex justify-center mb-4">
        <div className="max-w-xl min-w-60 p-3 rounded-lg bg-orange-500 text-white">
          <p>{message.mensagem}</p>
        </div>
      </div>
    );
  }

  function handleReplyActions(action: MessageAction) {
    // Lógica para lidar com a ação de resposta
    onClickMessageActions && onClickMessageActions(action, message);
  }

  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2`}
    >
      {!isReply && isCurrentUser && (
        <MessageReplyActions
          isCurrentUser={isCurrentUser}
          hideButtonEdit={fileType != null}
          onClick={handleReplyActions}
        />
      )}
      <div className={messageBoxClasses}>
        <MessageHeader
          name={getDisplayName()}
          date={formatDate(message.data)}
          isReply={isReply}
          isCurrentUser={isCurrentUser}
        />

        {message.message_reply && (
          <Message
            onClickMessageActions={onClickMessageActions}
            key={`${message.message_reply.id_mensagem}-reply`}
            message={message.message_reply}
            isCurrentUser={isCurrentUser}
            call={call}
            nomeLogado={nomeLogado}
            isReply
          />
        )}

        {renderContent()}

        {message.avaliation_buttons && (
          <MessageActions onCustomAction={onCustomAction} />
        )}

        <ImageModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          imageUrl={`${message.caminho_arquivo_ftp}/${message.nome_arquivo}`}
        />
      </div>
      {!isReply && !isCurrentUser && (
        <MessageReplyActions
          isCurrentUser={isCurrentUser}
          hideButtonEdit={fileType != null}
          onClick={handleReplyActions}
        />
      )}
    </div>
  );
}
