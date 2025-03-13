"use server";

export interface ChamadosDto {
  id_chamado: number;
  tecnico_responsavel: string;
  cnpj_operador: string;
  nome_operador: string;
  contato: string;
  id_operador: number;
  data_abertura: string;
  data_fechamento: string;
  status: string;
  link_operador: string;
  id_ticket: string;
  unread_messages: number;
}

export async function fetchChatsFromApi(
  cnpj: string,
  idOperador: string
): Promise<ChamadosDto> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const response = await fetch(
    `http://10.0.1.121:4000/chamados?cnpj=${cnpj}&idOperador=${idOperador}`
  );

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: ChamadosDto = await response.json();
  return data;
}
