"use server";

import { ChamadosDto } from "../../home/_actions/api";
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

export async function fetchMessagesByIdChamado(
  id_chamado: number
): Promise<MessageDto[]> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const response = await fetch(`http://10.0.1.121:4000/messages/${id_chamado}`);

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: MessageDto[] = await response.json();
  return data;
}
