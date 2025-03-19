"use server";

import { ChamadosDto } from "./dtos/chamado.dto";
import { MessageDto } from "./dtos/message-dto";

export async function fetchOpennedCals(): Promise<ChamadosDto[]> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const response = await fetch(`http://10.0.1.121:4000/chamados/open`);

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: ChamadosDto[] = await response.json();

  return data;
}

export async function fetchCallByIdOperadorAndCnpj(
  idOperador: number,
  cnpj: string
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

export async function fetchMessagesByIdChamado(
  id_chamado: number,
  nextPage: number,
  limit: number
): Promise<MessageDto[]> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const response = await fetch(
    `http://10.0.1.121:4000/messages/${id_chamado}?limit=${limit}&skip=${nextPage}`
  );

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: MessageDto[] = await response.json();
  return data;
}

export async function closeCall(chamado: number): Promise<MessageDto[]> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  console.log("idchamado: ", chamado);
  const response = await fetch(`http://10.0.1.121:4000/chamados/${chamado}`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: MessageDto[] = await response.json();
  return data;
}

export async function closeCallWithoutTicket(
  chamado: ChamadosDto
): Promise<MessageDto[]> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const response = await fetch(
    `http://10.0.1.121:4000/chamados/withoutticket/${chamado.id_chamado}`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: MessageDto[] = await response.json();
  return data;
}
