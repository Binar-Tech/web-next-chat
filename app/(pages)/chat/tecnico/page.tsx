"use client";
import ImagePreviewModal from "@/app/(pages)/chat/_components/image-preview-modal";
import Loading from "@/app/(pages)/chat/_components/loading";
import Message from "@/app/(pages)/chat/_components/message";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/app/hooks/useAuth";
import { formatDateTimeToDate } from "@/app/utils/data";
import { SendIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaPaperclip } from "react-icons/fa";
import {
  closeCall,
  closeCallWithoutTicket,
  fetchOpennedCals,
  uploadFile,
} from "../_actions/api";
import { AcceptCallDto } from "../_actions/dtos/accept-call.dto";
import { ChamadosDto } from "../_actions/dtos/chamado.dto";
import { CreateMessageDto } from "../_actions/dtos/create-message.dto";
import { EnterChatDto } from "../_actions/dtos/enter-chat.dto";
import { MessageDto } from "../_actions/dtos/message-dto";
import { ReturnChamadoDto } from "../_actions/dtos/returnChamado.dto";
import { User } from "../_actions/dtos/user.interface";
import { RoleEnum } from "../_actions/enums/role.enum";
import ChatList from "../_components/chat-list";
import ChatSidebar from "../_components/chat-navbar";
import ErrorPage from "../_components/error-page";
import NewMessageButton from "../_components/float-buttom-messages";
import ModalDragdrop from "../_components/modal-dragdrop";
import NewCallSeparator from "../_components/new-call-separator";
import NewDateSeparator from "../_components/new-date-separator";
import { useChatMessages } from "../_hooks/useChatMessages";
import { dropdownEventEmitter } from "../_services/dropdown-event/dropdown-event-emitter";
import { PerfilEnum } from "../_services/enums/perfil.enum";
import { eventManager } from "../_services/socket/eventManager";
import { socketService } from "../_services/socket/socketService";

export default function ChatTecnico() {
  // const searchParams = useSearchParams();
  // const nomeTecnico = searchParams.get("nomeTecnico");
  // const idTecnico = searchParams.get("idTecnico");

  const [calls, setCalls] = useState<ChamadosDto[] | null>(null);
  const [userLogged, setUserLogged] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<number>(0);
  const [selectedChat, setSelectedChat] = useState<ChamadosDto>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDragdrop, setModalDragdrop] = useState(false);
  const [message, setMessage] = useState("");
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [showNewMessageButtonText, setShowNewMessageButtonText] = useState("");
  const [lastMessageId, setLastMessageId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const selectedChatIdRef = useRef(selectedChatId);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userRef = useRef<User | null>(null);

  const { user, token } = useAuth();

  useEffect(() => {
    //console.log("USER LOGADO 11: ", user);
    if (user != null && user!.type != PerfilEnum.TECNICO) {
      setError("Erro nos dados do usuário!");
    }
  }, [user]);

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
          call.tecnico_responsavel === user?.id &&
          (call.id_chamado !== selectedChatIdRef.current ||
            call.tecnico_responsavel == null) &&
          call.id_chamado === message.id_chamado
        ) {
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

    if (document.hidden) {
      if (Notification.permission === "granted") {
        const notification = new Notification("Nova mensagem!", {
          body: "Clique para abrir o chat",
          icon: "/notification-icon.png",
        });

        // Toca o som ao clicar na notificação
        notification.onclick = () => {
          window.focus();
        };
      }
      window.parent.postMessage({ type: "NEW_MESSAGE_NOTIFICATION" }, "*");
    }
  }, []);

  //quando o tecnico aceita um chamado em aberto
  const onCallUpdated = useCallback((data: ChamadosDto) => {
    setCalls((prev) =>
      prev ? prev.map((c) => (c.id_chamado === data.id_chamado ? data : c)) : []
    );
  }, []);

  //quando o tecnico fecha um chamado
  const onCallClosed = useCallback((data: ChamadosDto) => {
    console.log("ENTROU NO CLOSE CALL");

    setCalls(
      (prev) => prev?.filter((c) => c.id_chamado !== data.id_chamado) || []
    );
    if (data.tecnico_responsavel === user?.id) {
      window.parent.postMessage(
        {
          type: "CLOSE_CALL",
          call: data,
          id_tecnico_logado: user?.id,
        },
        "*"
      );
    }

    if (selectedChatIdRef.current === data.id_chamado) {
      console.log("É O CHAT SELECIONADO");
      setMessages(() => []);
      setSelectedChatId(0);
      setSelectedChat(undefined);
    }
  }, []);

  const onEnteredCall = useCallback((data: any) => {
    console.log("entrou na call: ", data);
  }, []);

  const onLeaveCall = useCallback((data: any) => {
    console.log("saiu da call: ", data);
  }, []);

  const onUser = useCallback(async (data: User) => {
    console.log("USUARIO LOGADO: ", data);
    setUserLogged(data);
    userRef.current = data;
    await fetchData(data);
  }, []);

  const onCallOpen = useCallback(
    (data: ChamadosDto) => {
      console.log("NOVO CHAMADO ABERTO: ", data);
      console.log("USER LOGGED: ", userRef.current);
      if (!userRef.current?.tipo_usuario?.includes("ADMINISTRATORS")) {
        if (!userRef.current?.blacklist?.includes(data.cnpj_operador)) return;
      }

      // Filtra chamados onde tecnico_responsavel === null e o CNPJ está na blacklist

      const playSound = () => {
        const notificationSound = new Audio("/notify-new-call.mp3");
        notificationSound.play();
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
    },
    [userLogged]
  );

  //quando o operador loga e existem um chat aberto
  //os tecnicos que estiver no chat será notificado
  const handleLogged = useCallback(async (call: ReturnChamadoDto) => {
    if (call && call.id_chamado === selectedChatIdRef.current) {
      const n = Math.floor(Math.random() * (9999 - 999 + 1)) + 999;
      const message: MessageDto = {
        caminho_arquivo_ftp: "",
        data: new Date().toISOString(),
        id_chamado: call.id_chamado,
        mensagem: `O(a) operador(a) ${call.nome_operador} entrou no chat!`,
        id_mensagem: n,
        id_tecnico: call.tecnico_responsavel,
        nome_arquivo: "",
        remetente: "",
        tecnico_responsavel: call.tecnico_responsavel!,
        nome_tecnico: call.nome_tecnico,
        system_message: true,
      };

      setMessages((prev) => [...prev, message]);
    }
  }, []);

  const handleOperadorExited = useCallback(async (call: ReturnChamadoDto) => {
    //verifica se o chamado selecionado é igual ao do operador que deslogou

    if (call && call.id_chamado === selectedChatIdRef.current) {
      const n = Math.floor(Math.random() * (9999 - 999 + 1)) + 999;
      const message: MessageDto = {
        caminho_arquivo_ftp: "",
        data: new Date().toISOString(),
        id_chamado: call.id_chamado,
        mensagem: `O(a) operador(a) ${call.nome_operador} saiu do chat!`,
        id_mensagem: n,
        id_tecnico: call.tecnico_responsavel,
        nome_arquivo: "",
        remetente: "",
        tecnico_responsavel: call.tecnico_responsavel!,
        nome_tecnico: call.nome_tecnico,
        system_message: true,
      };

      setMessages((prev) => [...prev, message]);
    }
  }, []);

  // Efeitos de Drag & Drop
  const handleDragEnter = useCallback((event: DragEvent) => {
    console.log("ENTROU NO DRAG ENTER");
    event.preventDefault();
    setModalDragdrop(true);
  }, []);

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDragLeave = useCallback((event: DragEvent) => {
    // Evita fechar o modal se o mouse ainda estiver dentro da tela
    if (event.relatedTarget === null && event.clientY <= 0) {
      setModalDragdrop(false);
    }
  }, []);

  const handleDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    setModalDragdrop(false);

    if (event.dataTransfer?.files.length) {
      const uploadedFile = event.dataTransfer.files[0];
      const localUrl = URL.createObjectURL(uploadedFile);
      setImageUrl(localUrl);
      setFileUpload(uploadedFile);
      setModalOpen(true);
    }
  }, []);

  // 🔥 Conecta o socket apenas uma vez e adiciona/remover eventos corretamente
  useEffect(() => {
    //connectSocket();
    eventManager.on("connect", loginSocket);
    eventManager.on("logged", handleLogged);
    eventManager.on("open-call", onCallOpen);
    eventManager.on("new-message", handleNewMessage);
    eventManager.on("accepted-call", onCallUpdated);
    eventManager.on("closed-call", onCallClosed);
    eventManager.on("entered-call", onEnteredCall);
    eventManager.on("leaved-call", onLeaveCall);
    eventManager.on("user", onUser);
    eventManager.on("operador_exited", handleOperadorExited);

    return () => {
      eventManager.off("connect", loginSocket);
      eventManager.off("logged", handleLogged);
      eventManager.off("open-call", onCallOpen);
      eventManager.off("new-message", handleNewMessage);
      eventManager.off("accepted-call", onCallUpdated);
      eventManager.off("closed-call", onCallClosed);
      eventManager.off("entered-call", onEnteredCall);
      eventManager.off("leaved-call", onLeaveCall);
      eventManager.off("user", onUser);
      eventManager.off("operador_exited", handleOperadorExited);

      //socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, [handleDragEnter, handleDragOver, handleDragLeave, handleDrop]);

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

  useEffect(() => {}, [setShowNewMessageButton]);

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
    switch (action) {
      case "encerrar":
        await closeCall(selectedChatIdRef.current);
        break;
      case "encerrarOffTicket":
        await closeCallWithoutTicket(selectedChatIdRef.current);
        break;
      case "entrar":
        await enterCall(selectedChatIdRef.current, RoleEnum.SUPPORT);
        break;
      case "sair":
        await leaveCall(selectedChatIdRef.current, RoleEnum.SUPPORT);
        break;

      default:
        break;
    }
  };

  //carrega todos os chats abertos
  const fetchData = async (user: User) => {
    try {
      // Chama a função do servidor passando os parâmetros
      const result = await fetchOpennedCals();

      if (user?.tipo_usuario?.includes("ADMINISTRATORS")) {
        setCalls(result);
        return;
      }

      setCalls(result);

      // Filtra chamados onde tecnico_responsavel === null e o CNPJ está na blacklist
      const blacklistCalls = result.filter(
        (cal) =>
          cal.tecnico_responsavel === null &&
          user?.blacklist?.includes(cal.cnpj_operador)
      );

      // Pegamos o restante dos chamados que não entram na blacklistCalls
      const otherCalls = result.filter(
        (cal) => cal.tecnico_responsavel !== null
      );

      // Atualiza o estado combinando os dois arrays
      setCalls([...blacklistCalls, ...otherCalls]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginSocket = async () => {
    const data = {
      nome: user?.nome || "", // Se for null, usa string vazia
      cnpj: null, // Se for null, usa undefined (para campo opcional)
      type: PerfilEnum.TECNICO,
      id: user?.id || "", // Garante que seja um dos valores esperados
    };
    socketService.login(data);
  };

  // Atualiza o chat selecionado
  const handleChatSelect = async (chatId: number) => {
    setHasMoreMessages(true);
    setFirstLoad(true);
    if (chatId === selectedChat?.id_chamado) return;

    if (selectedChat) leaveCall(selectedChat.id_chamado, RoleEnum.OBSERVER);
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

  function leaveCall(chatId: number, role: RoleEnum) {
    const leave: EnterChatDto = {
      chatId,
      role,
    };
    socketService.leaveCall(leave);
  }

  function enterCall(chatId: number, role: RoleEnum) {
    const enterCall: EnterChatDto = {
      chatId,
      role,
    };
    socketService.enterCall(enterCall);
  }

  const handleAcceptCall = async (idChamado: number) => {
    const accetpCall: AcceptCallDto = {
      chatId: idChamado,
      technicianId: user?.id!,
      technicianName: user?.nome!,
    };

    socketService.acceptCall(accetpCall);
  };

  const handleOpenFilePicker = () => {
    if (selectedChatIdRef.current <= 0) {
      return;
    }
    fileInputRef.current?.click();
  };

  // Quando o usuário seleciona um arquivo
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setImageUrl(localUrl);
      setFileUpload(file);
      setModalOpen(true); // Abrir o modal automaticamente
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return; // Evita envio de mensagens vazias

    const newMessage: CreateMessageDto = {
      id_chamado: selectedChatIdRef.current,
      mensagem: message,
      remetente: PerfilEnum.TECNICO,
      tecnico_responsavel: user?.nome,
    };

    socketService.sendMessage(newMessage);

    setMessage(""); // Limpa o input após enviar

    inputRef.current?.focus(); //foca o cursor no input
  };

  const handleLoadMoreMessage = async () => {
    if (containerRef.current) {
      const { scrollTop } = containerRef.current;

      if (scrollTop === 0 && !loadingMoreMessages && hasMoreMessages) {
        if (messages.length > 0) {
          // Chama fetchMoreMessages quando o usuário rolar para o topo
          const moreMessages = await fetchMoreMessages(
            selectedChat?.id_operador?.toString() ?? "",
            selectedChat?.cnpj_operador ?? "",
            messages[0].id_mensagem,
            10
          );

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

    const altura = scrollHeight - scrollTop;

    if (altura - clientHeight >= 300 && showNewMessageButton !== true) {
      setShowNewMessageButton(true);
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

  const handleConfirmUpload = async () => {
    setUploading(true);
    try {
      const message: CreateMessageDto = {
        id_chamado: selectedChat!.id_chamado,
        mensagem: null,
        remetente: PerfilEnum.TECNICO,
        tecnico_responsavel: user?.nome,
      };
      const result = await uploadFile(fileUpload!, message, selectedChat!);
      socketService.sendMessage(result);
    } catch (error) {
    } finally {
      setModalOpen(false);
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="h-full">
        <Loading />
      </div>
    );
  if (error) return <ErrorPage message={error} />;
  return (
    <div className="flex w-full h-screen overflow-hidden border-none">
      {/* Modal de "Arraste o arquivo aqui" */}

      {/* Lado esquerdo - Lista de Chats */}
      <div className="flex w-[25%] flex-col overflow-hidden border-none">
        <ChatList
          onAcceptCall={handleAcceptCall}
          idUserLogged={user?.id!}
          chatList={calls || []}
          onSelect={handleChatSelect}
          selectedChatId={selectedChatId}
        />
      </div>

      {/* Lado direito - Chat */}
      <div className=" flex flex-1 flex-col overflow-hidden">
        <ChatSidebar
          token={token!}
          chat={selectedChat}
          idTecnico={user?.id!}
          isAdmin={userLogged?.tipo_usuario?.includes("ADMINISTRATORS")}
        />

        {/* Container de mensagens */}
        <div className="flex flex-col flex-1 p-6 overflow-hidden">
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
                      <NewCallSeparator id_chamado={message.id_chamado} />
                    )}

                    {/* Exibir divisor de data */}
                    {isNewDate && (
                      <NewDateSeparator messageDate={messageDate} />
                    )}

                    {/* Exibir a mensagem normalmente */}
                    <Message
                      call={selectedChat!}
                      message={message}
                      isCurrentUser={message.remetente === "TECNICO"}
                      nomeLogado={user?.nome!}
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
          <div className="mt-4 gap-2 flex flex-row ">
            <input
              ref={inputRef}
              type="text"
              placeholder="Mensagem..."
              className="w-full p-2 border border-gray-300 dark:bg-neutral-700 dark:border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button
              className="h-full bg-blue-400"
              onClick={handleOpenFilePicker}
            >
              <FaPaperclip />
            </Button>
            <Button className="h-full" onClick={handleSendMessage}>
              <SendIcon />
            </Button>
            <input
              type="file"
              accept="*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <ImagePreviewModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              imageUrl={imageUrl}
              onConfirm={handleConfirmUpload}
              isUploading={uploading}
              fileName={fileUpload?.name}
            />
            <ModalDragdrop open={modalDragdrop} />
          </div>
        </div>
      </div>
    </div>
  );
}
