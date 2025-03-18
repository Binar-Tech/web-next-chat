"use server";

import { ChamadosDto } from "../../chat/_actions/dtos/chamado.dto";

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
