"use client";
import ImagePreviewModal from "@/app/(pages)/chat/_components/image-preview-modal";
import Loading from "@/app/(pages)/chat/_components/loading";
import Message from "@/app/(pages)/chat/_components/message";
import { Button } from "@/app/_components/ui/button";
import { ClipboardIcon, SendIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChamadosDto } from "../../home/_actions/api";
import { fetchOpennedCals } from "../_actions/api";
import { CreateMessageDto } from "../_actions/dtos/create-message.dto";
import { MessageDto } from "../_actions/dtos/message-dto";
import ChatList from "../_components/chat-list";
import { useChatMessages } from "../_hooks/useChatMessages";
import { PerfilEnum } from "../_services/enums/perfil.enum";
import { eventManager } from "../_services/socket/eventManager";
import { socketService } from "../_services/socket/socketService";

export default function ChatTecnico() {
  const searchParams = useSearchParams();
  const nomeTecnico = searchParams.get("nomeTecnico");
  const idTecnico = searchParams.get("idTecnico");
  const [calls, setCalls] = useState<ChamadosDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState<number>(0);
  const selectedChatIdRef = useRef(selectedChatId);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { fetchMessages, loadingMessages, messages, setMessages } =
    useChatMessages();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  // 🔥 useCallback para evitar recriação desnecessária da função
  //ela será responsavel para tratar novas mensagens
  const handleNewMessage = useCallback(
    (message: MessageDto) => {
      //verifica se o chat selecionado é igual ao da mensagem que veio, para atualizar na tela
      console.log("message: ", message);
      console.log("chat selecionado: ", selectedChatIdRef.current);
      if (message.id_chamado === selectedChatIdRef.current) {
        setMessages((prev) => [...prev, message]);
      }

      //atualiza a lista de chamados
      //se pertencer ao tecnico logado ou em aberto, adiciona o contador de mensagens não lidas
      setCalls((prevCalls) => {
        if (!prevCalls) return prevCalls;

        console.log("prevCalls: ", prevCalls);

        let updatedCall: ChamadosDto | null = null;
        const otherCalls = prevCalls.filter((call) => {
          if (call.tecnico_responsavel === idTecnico) {
            updatedCall = {
              ...call,
              unread_messages: call.unread_messages
                ? call.unread_messages + 1
                : 1,
            };
            return false;
          }
          return true;
        });

        return updatedCall ? [updatedCall, ...otherCalls] : prevCalls;
      });
    },
    [selectedChatIdRef.current]
  );

  const onCallUpdated = useCallback((data: ChamadosDto) => {
    setCalls((prev) =>
      prev ? prev.map((c) => (c.id_chamado === data.id_chamado ? data : c)) : []
    );
  }, []);

  const onCallClosed = useCallback((data: { id: number }) => {
    setCalls((prev) => prev?.filter((c) => c.id_chamado !== data.id) || []);
  }, []);

  // 🔥 Conecta o socket apenas uma vez e adiciona/remover eventos corretamente
  useEffect(() => {
    //connectSocket();

    eventManager.on("new-message", handleNewMessage);
    eventManager.on("call-updated", onCallUpdated);
    eventManager.on("call-closed", onCallClosed);

    fetchData();

    return () => {
      eventManager.off("new-message", handleNewMessage);
      eventManager.off("call-updated", onCallUpdated);
      eventManager.off("call-closed", onCallClosed);

      //socketService.disconnect();
    };
  }, [handleNewMessage, onCallUpdated, onCallClosed]);

  useEffect(() => {
    connectSocket();

    return () => {
      socketService.disconnect();
    };
  }, []);

  //carrega todos os chats abertos
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
      nome: nomeTecnico || "", // Se for null, usa string vazia
      cnpj: null, // Se for null, usa undefined (para campo opcional)
      type: PerfilEnum.TECNICO,
      id: idTecnico || "", // Garante que seja um dos valores esperados
    };
    socketService.login(data);
  };

  // Atualiza o chat selecionado
  const handleChatSelect = async (chatId: number) => {
    //setLoadingMessages(true);
    setSelectedChatId(chatId);
    try {
      await fetchMessages(chatId, 1, 999);
      //setMessages(result);
    } catch (error) {
    } finally {
      //setLoadingMessages(false);
    }

    // Atualiza a call correspondente para unread_messages = 0
    setCalls((prevCalls) => {
      if (!prevCalls) return prevCalls;

      return prevCalls.map((call) =>
        call.id_chamado === chatId ? { ...call, unread_messages: 0 } : call
      );
    });
  };

  // Sempre que o estado mudar, atualiza o ref
  useEffect(() => {
    selectedChatIdRef.current = selectedChatId;
    console.log("atualizou o estado: ", selectedChatId);
  }, [selectedChatId]);

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = () => {
    console.log("clicou");
    if (!message.trim()) return; // Evita envio de mensagens vazias

    const newMessage: CreateMessageDto = {
      id_chamado: selectedChatIdRef.current,
      mensagem: message,
      remetente: PerfilEnum.TECNICO,
      tecnico_responsavel: nomeTecnico,
    };
    console.log("passou", newMessage);
    socketService.sendMessage(newMessage);

    setMessage(""); // Limpa o input após enviar

    inputRef.current?.focus(); //foca o cursor no input
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
            idUserLogged={idTecnico!}
            chatList={calls || []}
            onSelect={handleChatSelect}
            selectedChatId={selectedChatId}
          />
        </div>
      </div>

      {/* Lado direito - 80% da largura total */}
      <div className="bg-blue-400 flex-[4] h-full">
        <div className="flex flex-col h-screen p-6 bg-gray-100">
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto scroll-hidden"
          >
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
              ref={inputRef}
              type="text"
              placeholder="Type a message"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button
              className="h-full bg-blue-400"
              onClick={handleOpenFilePicker}
            >
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
    </div>
  );
}
