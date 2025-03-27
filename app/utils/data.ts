export function formatDate(dateString: string) {
  // Cria a data original recebida da API
  const date = new Date(dateString);

  // Adiciona 3 horas à data original (por exemplo, para corrigir a diferença de fuso)
  date.setHours(date.getHours() + 3); // Ajuste de 3 horas a mais

  const brazilOffset = 180;
  const localOffset = new Date().getTimezoneOffset();

  if (localOffset !== brazilOffset) {
    const offsetDifference = localOffset - brazilOffset;
    const minutes = date.getMinutes() - offsetDifference;
    if (minutes < 0) {
      const hoursToSubtract = Math.floor(Math.abs(minutes) / 60);
      date.setHours(date.getHours() - hoursToSubtract);
    } else date.setMinutes(date.getMinutes() - offsetDifference); // Ajusta os minutos para o fuso horário correto
  }

  // Verifica o fuso horário do cliente (exemplo: Brasília está GMT -3)
  const dateNow = new Date();
  const isToday =
    date.getDate() === dateNow.getDate() &&
    date.getMonth() === dateNow.getMonth() &&
    date.getFullYear() === dateNow.getFullYear();

  // Se a data for de hoje, retorna apenas a hora
  if (isToday) {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  // Caso contrário, retorna a data completa no formato desejado
  return date
    .toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "");
}

export function formatDateTimeToDate(dateString: string) {
  const date = new Date(dateString);
  date.setHours(date.getHours() + 3);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

// Saída: "24/10/24 16:51"
