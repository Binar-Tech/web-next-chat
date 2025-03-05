"use client";
import Loading from "@/app/_components/loading";
import Message from "@/app/_components/message";
import { Button } from "@/app/_components/ui/button";
import { ClipboardIcon, SendIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ChamadosDto } from "../../home/_actions/api";
import { fetchMessagesByIdChamado, fetchOpennedCals } from "../_actions/api";
import { MessageDto } from "../_actions/dtos/message-dto";
import ChatList from "../_components/chat-list";

export default function ChatTecnico() {
  const [calls, setCalls] = useState<ChamadosDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [error, setError] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  useEffect(() => {
    // Chama a Server Action
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
            <Button className="h-full bg-blue-400">
              <ClipboardIcon />
            </Button>
            <Button className="h-full">
              <SendIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
