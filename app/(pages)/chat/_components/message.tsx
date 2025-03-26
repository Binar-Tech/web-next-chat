"use client";

import { formatDate } from "@/app/_utils/data";
import { getFileType } from "@/app/_utils/file";
import { LucideDownload } from "lucide-react";
import { useState } from "react";
import { ChamadosDto } from "../_actions/dtos/chamado.dto";
import { MessageDto } from "../_actions/dtos/message-dto";
import { PerfilEnum } from "../_services/enums/perfil.enum";
import ImageBox from "./image-box";
import ImageModal from "./image-modal";

interface MessageProps {
  message: MessageDto;
  isCurrentUser: boolean;
  call: ChamadosDto;
  nomeLogado: string;
}

export default function Message({
  message,
  isCurrentUser,
  call,
  nomeLogado,
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
    if (isCurrentUser) {
      if (message.remetente === PerfilEnum.TECNICO) {
        if (message.tecnico_responsavel === nomeLogado) {
          return "Você";
        }
        return message.tecnico_responsavel;
      } else return "Você";
    } else {
      if (message.remetente === PerfilEnum.OPERADOR) {
        return call.nome_operador;
      } else return message.tecnico_responsavel;
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
          } mb-4`}
        >
          <div
            className={`max-w-xl min-w-60 p-2 rounded-lg ${
              isCurrentUser
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-neutral-600 text-gray-800 dark: text-foreground"
            }`}
          >
            {/* cabeçalho do box da mensagem, com nome e data */}
            <div className="flex flex-1 w-full flex-row justify-between items-center mb-2">
              <div
                className={`text-xs ${
                  isCurrentUser
                    ? "text-muted dark:text-foreground"
                    : "text-muted-foreground dark:text-gray-300"
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

            {/* Se for texto puro */}
            {message.mensagem && !isYouTubeLink(message.mensagem) && (
              <p className="text-sm dark:text-foreground">{message.mensagem}</p>
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
            <ImageModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              imageUrl={`${message.caminho_arquivo_ftp}/${message.nome_arquivo}`}
            />
          </div>
        </div>
      )}
    </>
  );
}
