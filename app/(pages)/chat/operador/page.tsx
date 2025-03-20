"use client";
import Loading from "@/app/(pages)/chat/_components/loading";
import Message from "@/app/(pages)/chat/_components/message";
import { Button } from "@/app/_components/ui/button";
import { ClipboardIcon, SendIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageDto } from "../_actions/dtos/message-dto";

import { Call } from "../_actions/dtos/call.interface";
import { CreateMessageDto } from "../_actions/dtos/create-message.dto";
import { ReturnChamadoDto } from "../_actions/dtos/returnChamado.dto";
import ImagePreviewModal from "../_components/image-preview-modal";
import { useChatMessages } from "../_hooks/useChatMessages";
import { PerfilEnum } from "../_services/enums/perfil.enum";
import { eventManager } from "../_services/socket/eventManager";
import { socketService } from "../_services/socket/socketService";

export default function ChatOperador() {
  const searchParams = useSearchParams();
  const nomeOperador = searchParams.get("nomeOperador") || "";
  const idOperador = searchParams.get("idOperador") || "";
  const cnpj = searchParams.get("cnpj") ?? null;
  const { messages, setMessages, loadingMessages, fetchMessages, error } =
    useChatMessages();
  const [modalOpen, setModalOpen] = useState(false);
  const [call, setCall] = useState<Call | null>(null);
  const [message, setMessage] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const onCallUpdated = useCallback((data: ReturnChamadoDto) => {
    //cria uma mensagem de sistema para notificar o operador
    console.log("chamado aceito: ", data);
    const message: MessageDto = {
      caminho_arquivo_ftp: "",
      data: new Date().toISOString(),
      id_chamado: data.id_chamado,
      mensagem: `Você será atendido pelo analista ${data.nome_tecnico}`,
      id_mensagem: 1231213123123,
      id_tecnico: "21312312",
      nome_arquivo: "",
      remetente: "",
      tecnico_responsavel: data.tecnico_responsavel!,
      nome_tecnico: data.nome_tecnico,
      system_message: true,
    };
    setMessages((prev) => {
      const updatedMessages = [...prev, message]; // Adiciona a mensagem no início
      return updatedMessages;
    });
    console.log("call accepted");
  }, []);

  const onEnteredCall = useCallback((data: any) => {
    console.log("entrou na call: ", data);
  }, []);

  const onLeaveCall = useCallback((data: any) => {
    console.log("entrou na call: ", data);
  }, []);

  const onCallClosed = useCallback((data: { id: number }) => {
    console.log("CALL CLOSED");
    router.replace(
      `/home?cnpj=${cnpj}&nomeOperador=${nomeOperador}&idOperador=${idOperador}`
    );
  }, []);

  useEffect(() => {
    // Criamos a função separadamente para poder referenciá-la depois
    const handleNewMessage = (message: MessageDto) => {
      console.log("message: ", message);
      setMessages((prev) => {
        const updatedMessages = [...prev, message]; // Adiciona a mensagem no início
        return updatedMessages;
      });
    };

    const handleLogged = async (call: Call) => {
      console.log("call:", call);
      if (call) {
        setCall(call);
        await fetchMessages(call.chamado.id_chamado, 1, 99999);
      } else {
        router.replace(
          `/home?cnpj=${cnpj}&nomeOperador=${nomeOperador}&idOperador=${idOperador}`
        );
      }
    };

    eventManager.on("connect", loginSocket);
    eventManager.on("new-message", handleNewMessage);
    eventManager.on("logged", handleLogged);
    eventManager.on("accepted-call", onCallUpdated);
    eventManager.on("entered-call", onEnteredCall);
    eventManager.on("leave-call", onLeaveCall);
    eventManager.on("closed-call", onCallClosed);

    return () => {
      eventManager.off("connect", loginSocket);
      eventManager.off("new-message", handleNewMessage); // Removemos corretamente o listener
      eventManager.off("logged", handleLogged);
      eventManager.off("accepted-call", onCallUpdated);
      eventManager.off("entered-call", onEnteredCall);
      eventManager.off("leave-call", onLeaveCall);
      eventManager.off("closed-call", onCallClosed);
    };
  }, []);

  useEffect(() => {
    connectSocket();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const connectSocket = async () => {
    try {
      socketService.connect();
      //await loginSocket();
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  //quando o usuário envia uma mensagem
  const handleSendMessage = () => {
    if (!message.trim()) return; // Evita envio de mensagens vazias

    const newMessage: CreateMessageDto = {
      id_chamado: call?.chamado.id_chamado!,
      mensagem: message,
      remetente: PerfilEnum.OPERADOR,
      tecnico_responsavel: null,
    };
    console.log("passou", newMessage);
    socketService.sendMessage(newMessage);

    setMessage(""); // Limpa o input após enviar

    inputRef.current?.focus(); //foca o cursor no input
  };

  // Quando o usuário seleciona um arquivo
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setImageUrl(localUrl);
      setModalOpen(true); // Abrir o modal automaticamente
    }
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  if (loadingMessages)
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
    <div className="bg-blue-400 flex-[4] h-full">
      <div className="flex flex-col h-screen p-6 bg-gray-100">
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto scroll-hidden"
        >
          {messages.map((message) => (
            <Message
              key={message.id_mensagem}
              message={message}
              isCurrentUser={message.remetente === "OPERADOR"}
              call={call?.chamado!}
              nomeLogado={nomeOperador}
            />
          ))}
        </div>
        <div className="mt-4 gap-2 flex flex-row">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button className="h-full bg-blue-400" onClick={handleOpenFilePicker}>
            <ClipboardIcon />
          </Button>
          <Button className="h-full" onClick={handleSendMessage}>
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
  );
}
