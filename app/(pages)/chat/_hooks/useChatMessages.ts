import { useState } from "react";
import {
  fetchMessagesByIdChamado,
  fetchMoreMessagesApi,
} from "../_actions/api";
import { MessageDto } from "../_actions/dtos/message-dto";

export function useChatMessages() {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = async (
    chatId: number,
    nextPage: number,
    limit: number
  ): Promise<MessageDto[]> => {
    setLoadingMessages(true);
    try {
      const result = await fetchMessagesByIdChamado(chatId, nextPage, limit);
      if (Array.isArray(result)) {
        const reversedMessages = result.reverse(); // Inverte a ordem das mensagens
        setMessages(reversedMessages);
        return result; // ✅ Retornamos as mensagens corretamente
      } else {
        console.error("Erro: Dados inválidos recebidos", result);
        return []; // ✅ Retornamos um array vazio em caso de erro
      }
    } catch (error: any) {
      console.error("Erro ao buscar mensagens:", error);
      setError(error);
      return []; // ✅ Garantimos um retorno consistente
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchMoreMessages = async (
    operador: string,
    cnpj: string,
    id_mensagem: number,
    limit: number
  ): Promise<MessageDto[]> => {
    console.log("BUSCANDO Mais MENSAGENS DO CHAT SELECIONADO");
    setLoadingMoreMessages(true);
    try {
      const result = await fetchMoreMessagesApi(
        operador,
        cnpj,
        id_mensagem,
        limit
      );
      console.log("RETORNO DA BUSCA: ", result);
      if (Array.isArray(result)) {
        const reversedMessages = result.reverse(); // Inverte a ordem das mensagens
        if (result.length > 0) {
          setMessages((prevMessages) => [...reversedMessages, ...prevMessages]);
        }
        // Adiciona as novas mensagens no início
        return result; // ✅ Retornamos as mensagens corretamente
      } else {
        console.error("Erro: Dados inválidos recebidos", result);
        return []; // ✅ Retornamos um array vazio em caso de erro
      }
    } catch (error: any) {
      console.error("Erro ao buscar mensagens:", error);
      setError(error);
      return []; // ✅ Garantimos um retorno consistente
    } finally {
      setLoadingMoreMessages(false);
    }
  };

  return {
    messages,
    setMessages,
    loadingMessages,
    loadingMoreMessages,
    fetchMessages,
    fetchMoreMessages,
    error,
  }; // Adicionamos o setMessages aqui
}
