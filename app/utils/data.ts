export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const dateNow = new Date();

  // Verifica se a data é de hoje
  const isToday =
    date.getDate() === dateNow.getDate() &&
    date.getMonth() === dateNow.getMonth() &&
    date.getFullYear() === dateNow.getFullYear();

  // Obter o fuso horário do usuário automaticamente
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (isToday) {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: userTimeZone, // Usa o fuso horário do usuário
    });
  }

  return date
    .toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: userTimeZone, // Usa o fuso horário do usuário
    })
    .replace(",", "");
}

export function formatDateTimeToDate(dateString: string) {
  const date = new Date(dateString);
  // Obter o fuso horário do usuário automaticamente
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: userTimeZone,
  });
}

// Saída: "24/10/24 16:51"
