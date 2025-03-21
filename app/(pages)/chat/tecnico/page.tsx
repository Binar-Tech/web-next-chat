"use client";
import ImagePreviewModal from "@/app/(pages)/chat/_components/image-preview-modal";
import Loading from "@/app/(pages)/chat/_components/loading";
import Message from "@/app/(pages)/chat/_components/message";
import { Button } from "@/app/_components/ui/button";
import { formatDateTimeToDate } from "@/app/_utils/data";
import { ClipboardIcon, SendIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  closeCall,
  closeCallWithoutTicket,
  fetchOpennedCals,
} from "../_actions/api";
import { AcceptCallDto } from "../_actions/dtos/accept-call.dto";
import { ChamadosDto } from "../_actions/dtos/chamado.dto";
import { CreateMessageDto } from "../_actions/dtos/create-message.dto";
import { EnterChatDto } from "../_actions/dtos/enter-chat.dto";
import { MessageDto } from "../_actions/dtos/message-dto";
import { RoleEnum } from "../_actions/enums/role.enum";
import ChatList from "../_components/chat-list";
import ChatSidebar from "../_components/chat-navbar";
import NewMessageButton from "../_components/float-buttom-messages";
import { useChatMessages } from "../_hooks/useChatMessages";
import { dropdownEventEmitter } from "../_services/dropdown-event/dropdown-event-emitter";
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
  const [selectedChat, setSelectedChat] = useState<ChamadosDto>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [showNewMessageButtonText, setShowNewMessageButtonText] = useState("");
  const [lastMessageId, setLastMessageId] = useState<number | null>(null);

  const selectedChatIdRef = useRef(selectedChatId);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    fetchMessages,
    fetchMoreMessages,
    loadingMessages,
    loadingMoreMessages,
    messages,
    setMessages,
  } = useChatMessages();

  // useCallback para evitar recriação desnecessária da função
  // ela será responsavel para tratar novas mensagens
  const handleNewMessage = useCallback((message: MessageDto) => {
    //verifica se o chat selecionado é igual ao da mensagem que veio, para atualizar na tela

    if (message.id_chamado === selectedChatIdRef.current) {
      setMessages((prev) => [...prev, message]);
    }

    //atualiza a lista de chamados
    //se pertencer ao tecnico logado ou em aberto, adiciona o contador de mensagens não lidas
    setCalls((prevCalls) => {
      if (!prevCalls) return prevCalls;

      let updated = false;

      const updatedCalls = prevCalls.map((call) => {
        if (
          call.tecnico_responsavel === idTecnico &&
          (call.id_chamado !== selectedChatIdRef.current ||
            call.tecnico_responsavel == null) &&
          call.id_chamado === message.id_chamado
        ) {
          console.log("call atualizado: ", call);
          console.log("selectedChatIdRef: ", selectedChatIdRef.current);
          console.log("idTecnico: ", idTecnico);

          updated = true; // Indica que pelo menos um item foi atualizado
          return {
            ...call,
            unread_messages: call.unread_messages
              ? call.unread_messages + 1
              : 1,
          };
        }

        console.log("call mantido: ", call);
        return call;
      });

      return updated ? updatedCalls : prevCalls;
    });
  }, []);

  //quando o tecnico aceita um chamado em aberto
  const onCallUpdated = useCallback((data: ChamadosDto) => {
    setCalls((prev) =>
      prev ? prev.map((c) => (c.id_chamado === data.id_chamado ? data : c)) : []
    );
  }, []);

  //quando o tecnico fecha um chamado
  const onCallClosed = useCallback((data: ChamadosDto) => {
    if (selectedChatIdRef.current === data.id_chamado) {
      console.log("LIMPANDO MENSAGENS");
      setMessages(() => []);
    }
    setSelectedChatId(0);
    setSelectedChat(undefined);
    setCalls(
      (prev) => prev?.filter((c) => c.id_chamado !== data.id_chamado) || []
    );
  }, []);

  const onEnteredCall = useCallback((data: any) => {
    console.log("entrou na call: ", data);
  }, []);

  const onLeaveCall = useCallback((data: any) => {
    console.log("saiu da call: ", data);
  }, []);

  const onCallOpen = useCallback((data: ChamadosDto) => {
    const playSound = () => {
      const notificationSound = new Audio("/notify-new-call.mp3");
      notificationSound
        .play()
        .catch((error) => console.error("Erro ao tocar som:", error));
    };

    if (document.hidden) {
      // Se a aba não estiver visível, mostra uma notificação
      if (Notification.permission === "granted") {
        const notification = new Notification("Nova chamada recebida!", {
          body: "Clique para abrir o chat",
          icon: "/notification-icon.png",
        });

        // Toca o som ao clicar na notificação
        notification.onclick = () => {
          window.focus();
          playSound();
        };
      }
    } else {
      playSound();
    }
    //playSound();
    window.parent.postMessage({ type: "NEW_CALL_NOTIFICATION" }, "*");

    setCalls((prev) => {
      const newCall: ChamadosDto = {
        ...data,
        unread_messages: 0,
      };
      return prev ? [...prev, newCall] : [newCall];
    });
  }, []);

  // 🔥 Conecta o socket apenas uma vez e adiciona/remover eventos corretamente
  useEffect(() => {
    //connectSocket();
    eventManager.on("connect", loginSocket);
    eventManager.on("open-call", onCallOpen);
    eventManager.on("new-message", handleNewMessage);
    eventManager.on("accepted-call", onCallUpdated);
    eventManager.on("closed-call", onCallClosed);
    eventManager.on("entered-call", onEnteredCall);
    eventManager.on("leaved-call", onLeaveCall);
    fetchData();

    return () => {
      eventManager.off("connect", loginSocket);
      eventManager.off("open-call", onCallOpen);
      eventManager.off("new-message", handleNewMessage);
      eventManager.off("accepted-call", onCallUpdated);
      eventManager.off("closed-call", onCallClosed);
      eventManager.off("entered-call", onEnteredCall);
      eventManager.off("leaved-call", onLeaveCall);

      //socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    try {
      socketService.connect();
    } catch (error) {}

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Sempre que o estado mudar, atualiza o ref
  useEffect(() => {
    selectedChatIdRef.current = selectedChatId;
  }, [selectedChatId]);

  //atualiza o scroll para o final do container
  const scrollToBottom = () => {
    setShowNewMessageButton(false);
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    dropdownEventEmitter.on("dropdownOpcoesClick", handleDropdownClick);

    return () => {
      dropdownEventEmitter.off("dropdownOpcoesClick", handleDropdownClick);
    };
  }, []);

  const handleDropdownClick = async (action: string) => {
    console.log(`Botão clicado: ${action}`);
    console.log(`chat selecionado: `, selectedChat);
    console.log(`chat selecionado: `, selectedChatId);
    console.log(`chat selecionado: `, selectedChatIdRef.current);
    switch (action) {
      case "encerrar":
        await closeCall(selectedChatIdRef.current);
        break;
      case "encerrarOffTicket":
        await closeCallWithoutTicket(selectedChatIdRef.current);
        break;
      case "entrar":
        enterCall(selectedChatId, RoleEnum.SUPPORT);
        break;
      case "sair":
        leaveCall(selectedChatId);
        break;

      default:
        break;
    }
  };

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
    setHasMoreMessages(true);
    setFirstLoad(true);
    if (chatId === selectedChat?.id_chamado) return;

    if (selectedChat) leaveCall(selectedChat.id_chamado);
    enterCall(chatId, RoleEnum.OBSERVER);
    setSelectedChatId(chatId);

    const resultCall = calls?.find((cal) => cal.id_chamado === chatId);
    setSelectedChat(resultCall);

    try {
      await fetchMessages(chatId, 1, 10);
      scrollToBottom();
    } catch (error) {}

    setCalls(
      (prevCalls) =>
        prevCalls?.map((call) =>
          call.id_chamado === chatId ? { ...call, unread_messages: 0 } : call
        ) || []
    );
  };

  function leaveCall(chatId: number) {
    const leave: EnterChatDto = {
      chatId,
      role: RoleEnum.OWNER,
    };
    socketService.leaveCall(leave);
  }

  function enterCall(chatId: number, role: RoleEnum) {
    const enterCall: EnterChatDto = {
      chatId,
      role: RoleEnum.OBSERVER,
    };
    socketService.enterCall(enterCall);
  }

  const handleAcceptCall = async (idChamado: number) => {
    const accetpCall: AcceptCallDto = {
      chatId: idChamado,
      technicianId: idTecnico!,
      technicianName: nomeTecnico!,
    };

    socketService.acceptCall(accetpCall);
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

  const handleLoadMoreMessage = async () => {
    if (containerRef.current) {
      const { scrollTop } = containerRef.current;

      if (scrollTop === 0 && !loadingMoreMessages && hasMoreMessages) {
        console.log(
          "ENTROU NO EFFECT PARA BUSCAR NOVAS MENSAGENS: ",
          scrollTop
        );
        console.log("CHAT SELECIONADO: ", selectedChat);

        if (messages.length > 0) {
          console.log("PRIMEIRA MENSAGEM: ", messages[0].id_mensagem);

          // Chama fetchMoreMessages quando o usuário rolar para o topo
          const moreMessages = await fetchMoreMessages(
            selectedChat?.id_operador?.toString() ?? "",
            selectedChat?.cnpj_operador ?? "",
            messages[0].id_mensagem,
            10
          );

          console.log("MENASGENS: ", moreMessages);

          if (moreMessages.length === 0 || moreMessages.length < 10) {
            // Se não houver mais mensagens ou menos de 10 mensagens, não buscar mais
            setHasMoreMessages(false);
          }
        }
      }
    }
  };

  const handleScroll = async () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isBottom = scrollHeight - scrollTop === clientHeight;
    setIsAtBottom(isBottom);

    if (isBottom) {
      setShowNewMessageButton(false);
    }

    if (containerRef.current.scrollTop === 0 && hasMoreMessages) {
      const previousHeight = containerRef.current.scrollHeight; // Salva altura antes do carregamento

      await handleLoadMoreMessage().then(() => {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            // Mantém a posição após adicionar mensagens
            containerRef.current.scrollTop =
              containerRef.current.scrollHeight - previousHeight;
          }
        });
      });
    }
  };

  //ARMAZENA O TAMANHO DO SCROLL DO CONTAINER AO CARREGAR AS MENSAGENS
  useEffect(() => {
    if (messages.length > 0 && firstLoad) {
      setFirstLoad(false); // Apenas na primeira carga rola para o final
      requestAnimationFrame(scrollToBottom);
    }

    if (isAtBottom) {
      scrollToBottom();
    } else {
      if (messages.length > 0) {
        if (lastMessageId !== null) {
          if (messages[messages.length - 1].id_mensagem > lastMessageId) {
            setShowNewMessageButtonText("Novas mensagens");
            setShowNewMessageButton(true);
          } else {
            setShowNewMessageButtonText("");
            setShowNewMessageButton(true);
          }
        }

        setLastMessageId(messages[messages.length - 1].id_mensagem);
      }
    }
  }, [messages]);

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
    <div className="flex w-full h-screen overflow-hidden">
      {/* Lado esquerdo - Lista de Chats */}
      <div className="flex-[1] min-w-72 flex flex-col overflow-hidden">
        <ChatList
          onAcceptCall={handleAcceptCall}
          idUserLogged={idTecnico!}
          chatList={calls || []}
          onSelect={handleChatSelect}
          selectedChatId={selectedChatId}
        />
      </div>

      {/* Lado direito - Chat */}
      <div className="bg-blue-400 flex-[4] flex flex-col overflow-hidden">
        <ChatSidebar chat={selectedChat} idTecnico={idTecnico!} />

        {/* Container de mensagens */}
        <div className="flex flex-col flex-1 p-6 bg-gray-100 overflow-hidden">
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto scroll-hidden"
          >
            {loadingMessages ? (
              <div className="h-full">
                <Loading />
              </div>
            ) : (
              messages.map((message, index) => {
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const messageDate = formatDateTimeToDate(message.data); // Função para formatar a data (Ex: "12/03/2024")
                const prevMessageDate = prevMessage
                  ? formatDateTimeToDate(prevMessage.data)
                  : null;

                const isNewDate = prevMessageDate !== messageDate;
                const isNewChamado =
                  prevMessage && prevMessage.id_chamado !== message.id_chamado;

                return (
                  <div key={message.id_mensagem}>
                    {/* Exibir divisor de chamado */}
                    {isNewChamado && (
                      <div className="flex justify-center my-4">
                        <div className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm">
                          Chamado #{message.id_chamado}
                        </div>
                      </div>
                    )}

                    {/* Exibir divisor de data */}
                    {isNewDate && (
                      <div className="flex justify-center my-4">
                        <div className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm">
                          {messageDate}
                        </div>
                      </div>
                    )}

                    {/* Exibir a mensagem normalmente */}
                    <Message
                      call={selectedChat!}
                      message={message}
                      isCurrentUser={message.remetente === "TECNICO"}
                      nomeLogado={nomeTecnico!}
                    />
                  </div>
                );
              })
            )}
            {showNewMessageButton && (
              <NewMessageButton
                onClick={scrollToBottom}
                text={showNewMessageButtonText}
              />
            )}
          </div>

          {/* Input de mensagem fixo no final */}
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
