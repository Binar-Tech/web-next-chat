"use client";
import Loading from "@/app/(pages)/chat/_components/loading";
import Message from "@/app/(pages)/chat/_components/message";
import { Button } from "@/app/components/ui/button";
import { SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageDto } from "../_actions/dtos/message-dto";

import { useAuth } from "@/app/hooks/useAuth";
import { formatDateTimeToDate } from "@/app/utils/data";
import { FaPaperclip } from "react-icons/fa";
import { uploadFile } from "../_actions/api";
import { Call } from "../_actions/dtos/call.interface";
import { CreateMessageDto } from "../_actions/dtos/create-message.dto";
import { ReturnChamadoDto } from "../_actions/dtos/returnChamado.dto";
import ErrorPage from "../_components/error-page";
import NewMessageButton from "../_components/float-buttom-messages";
import ImagePreviewModal from "../_components/image-preview-modal";
import ModalDragdrop from "../_components/modal-dragdrop";
import NewCallSeparator from "../_components/new-call-separator";
import NewDateSeparator from "../_components/new-date-separator";
import { useChatMessages } from "../_hooks/useChatMessages";
import { PerfilEnum } from "../_services/enums/perfil.enum";
import { eventManager } from "../_services/socket/eventManager";
import { socketService } from "../_services/socket/socketService";
// Componente para acessar os search params

export default function ChatOperador() {
  // const nomeOperador = useSearchParam("nomeOperador") || "";
  // const idOperador = useSearchParam("idOperador") || "";
  // const cnpj = useSearchParam("cnpj") ?? null;
  const { user, isAuthenticated, token } = useAuth();
  const [errorPage, setErrorPage] = useState("");

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [showNewMessageButtonText, setShowNewMessageButtonText] = useState("");
  const [lastMessageId, setLastMessageId] = useState<number | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [call, setCall] = useState<Call | null>(null);
  const [message, setMessage] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [modalDragdrop, setModalDragdrop] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    messages,
    setMessages,
    loadingMessages,
    loadingMoreMessages,
    fetchMessages,
    fetchMoreMessages,
    error,
    setError,
  } = useChatMessages();

  useEffect(() => {
    //console.log("USER LOGADO 11: ", user);
    if (!user && user!.type != PerfilEnum.OPERADOR) {
      setErrorPage("Erro nos dados do usuário!");
    }
  }, [user]);

  const router = useRouter();

  const handleNewMessage = useCallback(
    (message: MessageDto) => {
      setMessages((prev) => {
        const updatedMessages = [...prev, message]; // Adiciona a mensagem no início
        return updatedMessages;
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
    },
    [setMessages]
  );

  const onCallUpdated = useCallback(
    (data: ReturnChamadoDto) => {
      //cria uma mensagem de sistema para notificar o operador

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
    },
    [setMessages]
  );

  const onEnteredCall = useCallback(() => {
    //console.log("entrou na call: ", data);
  }, []);

  const onLeaveCall = useCallback(() => {
    //console.log("entrou na call: ", data);
  }, []);

  const onCallClosed = useCallback(
    (data: Call) => {
      console.log("CHAMADO FECHADO: ", data);
      if (data.chamado.status === "FECHADO") {
        router.replace(
          `/home?cnpj=${user!
            .cnpj!}&nomeOperador=${user?.nome!}&idOperador=${user!.id!}`
        );

        return;
      }
      setCall(data);
      const n = Math.floor(Math.random() * (9999 - 999 + 1)) + 999;
      const message: MessageDto = {
        caminho_arquivo_ftp: "",
        data: new Date().toISOString(),
        id_chamado: data.chamado.id_chamado,
        mensagem: `O técnico encerrou o atendimento. Você pode abrir um novo chamado caso precise de ajuda. `,
        id_mensagem: n,
        id_tecnico: "",
        nome_arquivo: "",
        remetente: "TECNICO",
        tecnico_responsavel: "",
        nome_tecnico: "",
        system_message: false,
      };

      setMessages((prev) => {
        const updatedMessages = [...prev, message]; // Adiciona a mensagem no início
        return updatedMessages;
      });
      const n2 = Math.floor(Math.random() * (9999 - 999 + 1)) + 999;
      const message2: MessageDto = {
        caminho_arquivo_ftp: "",
        data: new Date().toISOString(),
        id_chamado: data.chamado.id_chamado,
        mensagem: `Ajude a melhorar nosso atendimento! Avalie o atendimento do técnico. São apenas 3 perguntas!`,
        id_mensagem: n,
        id_tecnico: "",
        nome_arquivo: "",
        remetente: "TECNICO",
        tecnico_responsavel: "",
        nome_tecnico: "",
        system_message: false,
      };

      setMessages((prev) => {
        const updatedMessages = [...prev, message2]; // Adiciona a mensagem no início
        return updatedMessages;
      });
    },
    [user?.cnpj, user?.id, user?.nome, router]
  );

  const handleLogged = useCallback(
    async (call: Call) => {
      if (call) {
        setCall(call);
        const retorno = await fetchMessages(call.chamado.id_chamado, 1, 10);
        if (retorno.length < 10) {
          await fetchMoreMessages(
            call.chamado.id_operador.toString(),
            call.chamado.cnpj_operador,
            retorno.length > 0 ? retorno[0].id_mensagem : null,
            20
          );
        } else if (
          retorno &&
          retorno.length <= 0 &&
          call.chamado.tecnico_responsavel === null
        ) {
          //notifica o user que em breve será atendido por um analista
          const n = Math.floor(Math.random() * (9999 - 999 + 1)) + 999;
          const message: MessageDto = {
            caminho_arquivo_ftp: "",
            data: new Date().toISOString(),
            id_chamado: call.chamado.id_chamado,
            mensagem: `Em breve você será atendido por um de nossos analistas. Enquanto isso pode enviar suas dúvidas para agilizar o atendimento!`,
            id_mensagem: n,
            id_tecnico: "",
            nome_arquivo: "",
            remetente: "",
            tecnico_responsavel: "",
            nome_tecnico: "",
            system_message: true,
          };
          setMessages((prev) => {
            const updatedMessages = [...prev, message]; // Adiciona a mensagem no início
            return updatedMessages;
          });
        }
      } else {
        router.replace(`/home?data=${token}`);
      }

      if (call.chamado.status === "AVALIAR") {
        const generateRandomId = () =>
          Math.floor(Math.random() * (9999 - 999 + 1)) + 999;

        const baseMessage = {
          caminho_arquivo_ftp: "",
          data: new Date().toISOString(),
          id_chamado: call.chamado.id_chamado,
          id_tecnico: "",
          nome_arquivo: "",
          remetente: "TECNICO",
          tecnico_responsavel: "",
          nome_tecnico: "",
          system_message: false,
        };

        const message1: MessageDto = {
          ...baseMessage,
          mensagem: `O técnico encerrou o atendimento. Você pode abrir um novo chamado caso precise de ajuda.`,
          id_mensagem: generateRandomId(),
        };

        const message2: MessageDto = {
          ...baseMessage,
          mensagem: `Ajude a melhorar nosso atendimento avaliando o técnico. São apenas 3 perguntas!`,
          id_mensagem: generateRandomId(),
          avaliation_buttons: true,
        };

        setMessages((prev) => [...prev, message1, message2]);
      }
    },
    [
      user?.cnpj,
      user?.id,
      user?.nome,
      router,
      fetchMessages,
      fetchMoreMessages,
      setMessages,
    ]
  );

  // Efeitos de Drag & Drop
  const handleDragEnter = useCallback((event: DragEvent) => {
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

  useEffect(() => {
    // Criamos a função separadamente para poder referenciá-la depois

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
  }, [
    "handleLogged",
    "handleNewMessage",
    "loginSocket",
    "onCallClosed",
    "onCallUpdated",
    "onEnteredCall",
    "onLeaveCall",
  ]);

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
      nome: user!.nome || "", // Se for null, usa string vazia
      cnpj: user!.cnpj, // Se for null, usa undefined (para campo opcional)
      type: PerfilEnum.OPERADOR,
      id: user!.id, // Garante que seja um dos valores esperados
    };
    socketService.login(data);
  };

  useEffect(() => {
    //scrollToBottom();

    if (messages.length > 0 && firstLoad) {
      setFirstLoad(false); // Apenas na primeira carga rola para o final
      requestAnimationFrame(scrollToBottom);
      setLastMessageId(messages[messages.length - 1].id_mensagem);
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

  useEffect(() => {}, [setShowNewMessageButton]);

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
      setFileUpload(file);
      setModalOpen(true); // Abrir o modal automaticamente
    }
  };

  const handleConfirmUpload = async () => {
    setUploading(true);
    try {
      const message: CreateMessageDto = {
        id_chamado: call!.chamado!.id_chamado,
        mensagem: null,
        remetente: PerfilEnum.OPERADOR,
        nome_arquivo: fileUpload!.name,
      };
      const result = await uploadFile(fileUpload!, message, call!.chamado!);
      socketService.sendMessage(result);
    } catch (error) {
    } finally {
      setModalOpen(false);
      setUploading(false);
    }
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleLoadMoreMessage = async () => {
    if (containerRef.current) {
      const { scrollTop } = containerRef.current;

      if (scrollTop === 0 && !loadingMoreMessages && hasMoreMessages) {
        if (messages.length > 0) {
          // Chama fetchMoreMessages quando o usuário rolar para o topo
          const moreMessages = await fetchMoreMessages(
            call?.chamado.id_operador.toString() ?? "",
            call?.chamado.cnpj_operador ?? "",
            messages[0].id_mensagem ?? null,
            20
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

  const handleAvaliationClick = (flag: boolean) => {
    console.log("BOTAO CLICADO: ", flag);
  };

  if (loadingMessages)
    return (
      <div className="h-full">
        <Loading />
      </div>
    );

  if (error) return <ErrorPage message={error} />;
  if (!isAuthenticated)
    return <ErrorPage message={"Usuário não autenticado!"} />;
  return (
    <div className="bg-blue-400 flex-[4] h-full">
      <div className="flex flex-col h-screen p-2 bg-gray-100 overflow-hidden">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto scroll-hidden"
        >
          <>
            {messages.map((message, index) => {
              let id_chamado = index > 0 ? messages[index - 1].id_chamado : 0;
              let prevMessage = index > 0 ? messages[index - 1] : null;
              const messageDate = formatDateTimeToDate(message.data); // Função para formatar a data (Ex: "12/03/2024")
              const prevMessageDate = prevMessage
                ? formatDateTimeToDate(prevMessage.data)
                : null;

              const isNewDate = prevMessageDate !== messageDate;
              let isNewChamado =
                prevMessage && prevMessage.id_chamado !== message.id_chamado;

              if (index === 0) {
                isNewChamado = true;
                id_chamado = call?.chamado.id_chamado!;
              }
              return (
                <div key={message.id_mensagem}>
                  {/* Exibir divisor de chamado */}
                  {/* Exibir divisor de chamado */}
                  {isNewChamado && (
                    <NewCallSeparator id_chamado={id_chamado!} />
                  )}

                  {/* Exibir divisor de data */}
                  {isNewDate && <NewDateSeparator messageDate={messageDate} />}

                  {/* Exibir a mensagem normalmente */}
                  <Message
                    call={call?.chamado!}
                    message={message}
                    isCurrentUser={message.remetente === "OPERADOR"}
                    nomeLogado={user?.nome!}
                    onCustomAction={handleAvaliationClick}
                  />
                </div>
              );
            })}

            {/* Se nenhuma mensagem pertence ao chamado atual, mostrar o separador */}
            {call?.chamado &&
              !messages.some(
                (msg) => msg.id_chamado === call.chamado.id_chamado
              ) && <NewCallSeparator id_chamado={call.chamado.id_chamado} />}
          </>
        </div>
        {showNewMessageButton && (
          <NewMessageButton
            onClick={scrollToBottom}
            text={showNewMessageButtonText}
          />
        )}
        <div className="mt-4 gap-2 flex flex-row">
          <input
            ref={inputRef}
            type="text"
            placeholder="Mensagem..."
            className="w-full p-2 border border-gray-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            className="h-full bg-blue-400"
            onClick={handleOpenFilePicker}
            disabled={call?.chamado.status !== "ABERTO"}
          >
            <FaPaperclip />
          </Button>
          <Button
            className="h-full"
            onClick={handleSendMessage}
            disabled={call?.chamado.status !== "ABERTO"}
          >
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
            onConfirm={handleConfirmUpload}
            isUploading={uploading}
            fileName={fileUpload?.name}
          />

          <ModalDragdrop open={modalDragdrop} />
        </div>
      </div>
    </div>
  );
}
