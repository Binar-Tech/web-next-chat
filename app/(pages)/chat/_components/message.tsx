"use client";

import { Button } from "@/app/components/ui/button";
import { formatDate } from "@/app/utils/data";
import { getFileType } from "@/app/utils/file";
import { LucideDownload } from "lucide-react";
import { useState } from "react";
import { ChamadosDto } from "../_actions/dtos/chamado.dto";
import { MessageDto } from "../_actions/dtos/message-dto";
import { PerfilEnum } from "../_services/enums/perfil.enum";
import AudioPlayer from "./audio-player";
import ImageBox from "./image-box";
import ImageModal from "./image-modal";

interface MessageProps {
  message: MessageDto;
  isCurrentUser: boolean;
  call: ChamadosDto;
  nomeLogado: string;
  isReply?: boolean;
  onCustomAction?: (flag: boolean) => void;
}

export default function Message({
  message,
  isCurrentUser,
  call,
  nomeLogado,
  onCustomAction,
  isReply = false,
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

  // Função para obter a URL do arquivo
  const getFileUrl = () => {
    return `${fileBaseUrl}?path=${message.caminho_arquivo_ftp}/${message.nome_arquivo}`;
  };

  const getVideoUrl = () => {
    return `${fileBaseUrl}/videos?path=${message.caminho_arquivo_ftp}/${message.nome_arquivo}`;
  };

  // Tipo do arquivo baseado na extensão
  const fileType = getFileType(message.nome_arquivo);

  //verifica qual nome exibir no box da mensagem {voce, operador, ou tecnico}
  function handleNameUserOnMessageBox(): string {
    // 🔹 Se for uma RESPOSTA (reply)
    if (isReply) {
      if (message.remetente === PerfilEnum.OPERADOR) {
        // Se o operador for o logado → Você
        return call.nome_operador === nomeLogado ? "Você" : call.nome_operador;
      } else {
        // Técnico
        return message.tecnico_responsavel === nomeLogado
          ? "Você"
          : message.tecnico_responsavel;
      }
    }

    // 🔹 Se for a mensagem principal
    if (isCurrentUser) {
      if (message.remetente === PerfilEnum.TECNICO) {
        return message.tecnico_responsavel === nomeLogado
          ? "Você"
          : message.tecnico_responsavel;
      } else {
        return "Você";
      }
    } else {
      if (message.remetente === PerfilEnum.OPERADOR) {
        return call.nome_operador;
      } else {
        return message.tecnico_responsavel;
      }
    }
  }

  return (
    <>
      {message.system_message ? (
        <div className={`flex justify-center mb-4`}>
          <div className="max-w-xl min-w-60 p-3 rounded-lg bg-orange-500 text-white ">
            <p>{message.mensagem}</p>
          </div>
        </div>
      ) : (
        <div
          className={`flex ${
            isCurrentUser ? "justify-end" : "justify-start"
          } mb-2`}
        >
          {/* Reply indicator
          {!isReply && isCurrentUser && (
            <div className="p-1 flex items-center justify-center ">
              <DropdownMenu>
                <DropdownMenuTrigger className="border-none outline-none ring-0 focus:outline-none focus:ring-0">
                  <EllipsisVerticalIcon size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="">
                  <DropdownMenuItem>
                    <Reply size={14} />
                    <div>Responder</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Trash size={14} />
                    <div>Apagar</div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )} */}
          {/* Espaço para alinhamento */}
          <div
            className={`max-w-xl min-w-60 p-2 rounded-lg ${
              isReply
                ? isCurrentUser
                  ? "bg-blue-600"
                  : "bg-gray-300 dark:bg-neutral-700"
                : isCurrentUser
                ? "bg-blue-500"
                : "bg-gray-200 dark:bg-neutral-600"
            }`}
          >
            {/* cabeçalho do box da mensagem, com nome e data */}
            <div className="flex flex-1 w-full flex-row justify-between items-center mb-2">
              <div
                className={`${isReply ? "text-[11px]" : "text-xs"}  pr-4 ${
                  isCurrentUser
                    ? "text-muted dark:text-foreground font-semibold font-serif"
                    : "text-orange-400 dark:text-orange-400 font-extrabold font-serif"
                } `}
              >
                {handleNameUserOnMessageBox()}
              </div>
              <div
                className={`text-[.7rem] ${
                  isCurrentUser
                    ? "text-muted dark:text-foreground"
                    : "text-muted-foreground dark:text-gray-300"
                } `}
              >
                {formatDate(message.data)}
              </div>
            </div>

            {message.message_reply && (
              <Message
                message={message.message_reply}
                isCurrentUser={isCurrentUser}
                call={call}
                nomeLogado={nomeLogado}
                isReply={true}
              />
            )}

            {/* Se for texto puro */}
            {message.mensagem && !isYouTubeLink(message.mensagem) && (
              <p
                className={`${isReply ? "text-xs" : "text-sm"} ${
                  isCurrentUser ? "text-muted" : ""
                }  dark:text-foreground`}
              >
                {message.mensagem}
              </p>
            )}

            {/* Se for um link do YouTube */}
            {message.mensagem && isYouTubeLink(message.mensagem) && (
              <iframe
                width="250"
                height="140"
                src={getYouTubeEmbedUrl(message.mensagem)}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            )}

            {/* Se for uma imagem */}
            {fileType === "imagem" && (
              <ImageBox
                onClickImage={() => setModalOpen(true)}
                key={message.id_mensagem}
                src={getFileUrl()}
              />
            )}

            {/* Se for um vídeo */}
            {fileType === "video" && (
              <div className="w-[250px] h-[440px] ">
                <video controls className="w-full h-full rounded-lg">
                  <source src={getVideoUrl()} type="video/mp4" />
                  Seu navegador não suporta vídeos.
                </video>
              </div>
            )}

            {/* Se for um arquivo (PDF, TXT, etc.) */}
            {fileType === "arquivo" && (
              <a
                href={getFileUrl()}
                download={message.nome_arquivo}
                rel=""
                className=" mt-2 bg-blue-700 text-white px-3 py-2 rounded-lg text-sm text-center content-center flex flex-row items-center gap-2"
              >
                <LucideDownload size={18} />
                {message.nome_arquivo}
              </a>
            )}

            {/* Se for um arquivo de audio webm, mp3 */}
            {fileType === "audio" && (
              <div className="mt-2 flex flex-col gap-2">
                {/* Player de áudio */}
                {/* <audio controls className="w-full rounded-lg">
                  <source src={getFileUrl()} type="audio/webm" />
                  <source src={getFileUrl()} type="audio/mp3" />
                  Seu navegador não suporta o player de áudio.
                </audio> */}
                <AudioPlayer apiUrl={getFileUrl()} />

                {/* Botão de download */}
              </div>
            )}

            {fileType === "other" && (
              <a
                href={getFileUrl()} // Certifique-se de que `fileUrl` seja um link válido
                download={message.nome_arquivo} // Define o nome do arquivo para download
                rel=""
                className="mt-2 bg-blue-700 text-white px-3 py-2 rounded-lg text-sm text-center flex flex-row items-center gap-2"
              >
                <LucideDownload size={18} />
                {message.nome_arquivo}
              </a>
            )}

            {message.avaliation_buttons && (
              <div className="flex flex-row items-center justify-center gap-2 pt-4">
                <Button
                  className="flex flex-1"
                  onClick={() => onCustomAction?.(true)}
                >
                  Avaliar
                </Button>
                <Button
                  className="bg-red-700 hover:bg-red-600 flex flex-1"
                  onClick={() => onCustomAction?.(false)}
                >
                  Agora não!
                </Button>
              </div>
            )}
            <ImageModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              imageUrl={`${message.caminho_arquivo_ftp}/${message.nome_arquivo}`}
            />
          </div>
          {/* Se NÃO for usuário logado, R vem DEPOIS do box
          {!isReply && !isCurrentUser && (
            <div className="p-1 flex items-center justify-center ">
              <DropdownMenu>
                <DropdownMenuTrigger className="border-none outline-none ring-0 focus:outline-none focus:ring-0">
                  <EllipsisVerticalIcon size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="">
                  <DropdownMenuItem>
                    <Reply size={14} />
                    <div>Responder</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Trash size={14} />
                    <div>Apagar</div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )} */}
          <div />
        </div>
      )}
    </>
  );
}
