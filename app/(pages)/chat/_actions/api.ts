"use server";

import { ChamadosDto } from "./dtos/chamado.dto";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { MessageDto } from "./dtos/message-dto";

export async function fetchOpennedCals(): Promise<ChamadosDto[]> {
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API;
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const response = await fetch(`${fileBaseUrl}/chamados/open`);

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: ChamadosDto[] = await response.json();

  return data;
}

export async function fetchMessagesByIdChamado(
  id_chamado: number,
  nextPage: number,
  limit: number
): Promise<MessageDto[]> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API;
  const response = await fetch(
    `${fileBaseUrl}/messages/${id_chamado}?limit=${limit}&skip=${nextPage}`
  );

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: MessageDto[] = await response.json();
  return data;
}

export async function fetchMoreMessagesApi(
  operador: string,
  cnpj: string,
  id_mensagem: number,
  limit: number
): Promise<MessageDto[]> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API;
  const response = await fetch(
    `${fileBaseUrl}/messages/more-messages?operador=${operador}&cnpj=${cnpj}&id_mensagem=${id_mensagem}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: MessageDto[] = await response.json();
  return data;
}

export async function closeCall(chamado: number): Promise<MessageDto> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API;
  console.log("idchamado: ", chamado);
  const response = await fetch(`${fileBaseUrl}/chamados/${chamado}`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: MessageDto = await response.json();
  return data;
}

export async function closeCallWithoutTicket(
  chamado: number
): Promise<MessageDto> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API;
  const response = await fetch(
    `${fileBaseUrl}/chamados/withoutticket/${chamado}`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: MessageDto = await response.json();
  return data;
}

export async function uploadFile(
  file: File,
  message: CreateMessageDto,
  chamado: ChamadosDto
): Promise<CreateMessageDto> {
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API;
  const formData = new FormData();
  formData.append("file", file); // Arquivo
  formData.append("body", JSON.stringify(message));
  const response = await fetch(
    `${fileBaseUrl}/files/${chamado.cnpj_operador}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: CreateMessageDto = await response.json();
  return data;
}
