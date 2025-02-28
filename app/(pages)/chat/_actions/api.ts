"use server";

import { ChamadosDto } from "../../home/_actions/api";

export async function fetchOpennedCals(): Promise<ChamadosDto[]> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const response = await fetch(`http://10.0.1.121:4000/chamados/open`);

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: ChamadosDto[] = await response.json();
  return data;
}
