import { useState } from "react";
import { fetchMessagesByIdChamado } from "../_actions/api";
import { MessageDto } from "../_actions/dtos/message-dto";

export function useChatMessages() {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = async (chatId: number) => {
    setLoadingMessages(true);
    try {
      const result = await fetchMessagesByIdChamado(chatId);
      setMessages(result);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  return { messages, setMessages, loadingMessages, fetchMessages, error }; // 👈 Adicionamos o setMessages aqui
}
