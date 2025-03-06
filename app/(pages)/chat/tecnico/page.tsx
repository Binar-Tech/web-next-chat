"use client";
import ImagePreviewModal from "@/app/_components/image-preview-modal";
import Loading from "@/app/_components/loading";
import Message from "@/app/_components/message";
import { Button } from "@/app/_components/ui/button";
import { ClipboardIcon, SendIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChamadosDto } from "../../home/_actions/api";
import { fetchMessagesByIdChamado, fetchOpennedCals } from "../_actions/api";
import { MessageDto } from "../_actions/dtos/message-dto";
import { socketService } from "../_actions/socket-service";
import ChatList from "../_components/chat-list";

export default function ChatTecnico() {
  const searchParams = useSearchParams();
  const nomeOperador = searchParams.get("nomeTecnico");
  const [calls, setCalls] = useState<ChamadosDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [error, setError] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Chama a Server Action
    connectSocket();
    const fetchData = async () => {
      try {
        // Chama a função do servidor passando os parâmetros
        const result = await fetchOpennedCals();
        setCalls(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const connectSocket = async () => {
    try {
      socketService.connect();
      await loginSocket();
    } catch (error) {}

    return () => {
      socketService.disconnect();
    };
  };

  const loginSocket = async () => {
    const data = {
      nome: nomeOperador || "", // Se for null, usa string vazia
      cnpj: null, // Se for null, usa undefined (para campo opcional)
      type: "TECNICO" as "TECNICO" | "OPERADOR", // Garante que seja um dos valores esperados
    };
    socketService.login(data);
  };

  // Atualiza o chat selecionado
  const handleChatSelect = async (chatId: number) => {
    setLoadingMessages(true);
    setSelectedChatId(chatId);
    try {
      const result = await fetchMessagesByIdChamado(chatId);
      setMessages(result);
    } catch (error) {
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Quando o usuário seleciona um arquivo
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Abrindo seletor de arquivos...");
    const file = event.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setImageUrl(localUrl);
      setModalOpen(true); // Abrir o modal automaticamente
    }
  };

  if (loading)
    return (
      <div className="h-full">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div>
        <p>Erro: {error}</p>
      </div>
    );
  return (
    <div className="flex w-full h-screen">
      {/* Lado esquerdo - 20% da largura total */}
      <div className="bg-slate-600 flex-[1] h-full min-w-72">
        <div className="flex h-screen bg-gray-100">
          <ChatList
            chatList={calls!}
            onSelect={handleChatSelect}
            selectedChatId={selectedChatId}
          />
        </div>
      </div>

      {/* Lado direito - 80% da largura total */}
      <div className="bg-blue-400 flex-[4] h-full">
        <div className="flex flex-col h-screen p-6 bg-gray-100">
          <div className="flex-1 overflow-y-auto flex flex-col-reverse">
            {loadingMessages ? (
              <div className="h-full">
                <Loading />
              </div>
            ) : (
              messages.map((message) => (
                <Message
                  key={message.id_mensagem}
                  message={message}
                  isCurrentUser={message.remetente === "TECNICO"}
                />
              ))
            )}
          </div>
          <div className="mt-4 gap-2 flex flex-row">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              className="h-full bg-blue-400"
              onClick={handleOpenFilePicker}
            >
              <ClipboardIcon />
            </Button>
            <Button className="h-full">
              <SendIcon />
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <ImagePreviewModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              imageUrl={imageUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
