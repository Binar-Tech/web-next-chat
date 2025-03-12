"use client";
import Loading from "@/app/_components/loading";
import Message from "@/app/_components/message";
import { Button } from "@/app/_components/ui/button";
import { ClipboardIcon, SendIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { MessageDto } from "../_actions/dtos/message-dto";

import { useChatMessages } from "../_hooks/useChatMessages";
import { useFetchCalls } from "../_hooks/useFetchCalls";
import { PerfilEnum } from "../_services/enums/perfil.enum";
import { eventManager } from "../_services/socket/eventManager";
import { socketService } from "../_services/socket/socketService";

export default function ChatOperador() {
  const searchParams = useSearchParams();
  const nomeOperador = searchParams.get("nomeOperador") || "";
  const idOperador = searchParams.get("idOperador") || "";
  const cnpj = searchParams.get("cnpj") ?? null;
  const { data: calls, loading, error } = useFetchCalls();
  const { messages, setMessages, loadingMessages, fetchMessages } =
    useChatMessages();

  useEffect(() => {
    connectSocket();

    //socketService.login({ nome: nomeOperador, cnpj, type: "OPERADOR" });

    // Criamos a função separadamente para poder referenciá-la depois
    const handleNewMessage = (message: MessageDto) => {
      setMessages((prev) => [...prev, message]);
    };

    eventManager.on("message", handleNewMessage);

    return () => {
      eventManager.off("message", handleNewMessage); // Removemos corretamente o listener
      socketService.disconnect();
    };
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
      cnpj: cnpj, // Se for null, usa undefined (para campo opcional)
      type: PerfilEnum.OPERADOR,
      id: idOperador, // Garante que seja um dos valores esperados
    };
    socketService.login(data);
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
      <div className="bg-blue-400 flex-1 h-full">
        <div className="flex flex-col h-screen p-6 bg-gray-100">
          <div className="flex-1 overflow-y-auto">
            {loadingMessages ? (
              <div className="h-full">
                <Loading />
              </div>
            ) : (
              messages.map((message) => (
                <Message
                  key={message.id_mensagem}
                  message={message}
                  isCurrentUser={message.remetente === "OPERADOR"}
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
