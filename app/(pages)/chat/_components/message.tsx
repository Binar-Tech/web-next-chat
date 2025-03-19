"use client";

import formatDate from "@/app/_utils/data";
import { useEffect, useRef, useState } from "react";
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
  const fileBaseUrl = "http://localhost:4000/files/images";

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

  // Identificar a extensão do arquivo
  const getFileType = () => {
    if (!message.nome_arquivo) return null;
    const ext = message.nome_arquivo.split(".").pop()?.toLowerCase();

    if (ext) {
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
      const videoExtensions = ["mp4", "avi", "mov", "wmv", "mkv", "flv"];
      const documentExtensions = ["pdf", "txt", "doc", "docx", "xls", "xlsx"];

      if (imageExtensions.includes(ext)) return "imagem";
      if (videoExtensions.includes(ext)) return "video";
      if (documentExtensions.includes(ext)) return "arquivo";
    }
    return "desconhecido";
  };

  // Tipo do arquivo baseado na extensão
  const fileType = getFileType();

  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imageRef.current) observer.observe(imageRef.current);

    return () => observer.disconnect();
  }, []);

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
        <div className={`flex justify-center mb-4  `}>
          <div className="max-w-xl min-w-60 p-3 rounded-lg bg-orange-500 text-white">
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
            className={`max-w-xl min-w-60 p-3 rounded-lg ${
              isCurrentUser
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <div className="flex flex-1 w-full flex-row justify-between items-center mb-2">
              <div
                className={`text-xs  ${
                  isCurrentUser ? "text-muted" : "text-muted-foreground"
                } `}
              >
                {handleNameUserOnMessageBox()}
              </div>
              <div
                className={`text-[.7rem] ${
                  isCurrentUser ? "text-muted" : "text-muted-foreground"
                } `}
              >
                {formatDate(message.data)}
              </div>
            </div>
            {/* Se for texto puro */}
            {message.mensagem && !isYouTubeLink(message.mensagem) && (
              <p>{message.mensagem}</p>
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
                  <source src={getFileUrl()} type="video/mp4" />
                  Seu navegador não suporta vídeos.
                </video>
              </div>
            )}

            {/* Se for um arquivo (PDF, TXT, etc.) */}
            {fileType === "arquivo" && (
              <a
                href={getFileUrl()}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 bg-blue-700 text-white px-3 py-2 rounded-lg text-sm text-center"
              >
                📄 Baixar arquivo
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
