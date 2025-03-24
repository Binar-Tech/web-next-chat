"use server";

import { ChamadosDto } from "../../chat/_actions/dtos/chamado.dto";
import { ReturnChamadoDto } from "../../chat/_actions/dtos/returnChamado.dto";
import { CreateChamadoDto } from "./dtos/create-chamado.dto";

export async function fetchCallByIdOperadorAndCnpj(
  idOperador: number,
  cnpj: string
): Promise<ChamadosDto> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API;
  const response = await fetch(
    `${fileBaseUrl}/chamados?cnpj=${cnpj}&idOperador=${idOperador}`
  );

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: ChamadosDto = await response.json();

  return data;
}

export async function createChamado(
  chamado: CreateChamadoDto
): Promise<ReturnChamadoDto> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API;
  const response = await fetch(`${fileBaseUrl}/chamados`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chamado),
  });

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: ChamadosDto = await response.json();

  return data;
}
