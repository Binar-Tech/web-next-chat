import { useState } from "react";
import { fetchMessagesByIdChamado } from "../_actions/api";
import { MessageDto } from "../_actions/dtos/message-dto";

export function useChatMessages() {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = async (
    chatId: number,
    nextPage: number,
    limit: number
  ): Promise<MessageDto[]> => {
    console.log("BUSCANDO MENSAGENS DO CHAT SELECIONADO");
    setLoadingMessages(true);
    try {
      const result = await fetchMessagesByIdChamado(chatId, nextPage, limit);
      if (Array.isArray(result)) {
        setMessages(result);
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

  return { messages, setMessages, loadingMessages, fetchMessages, error }; // 👈 Adicionamos o setMessages aqui
}
