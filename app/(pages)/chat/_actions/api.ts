"use server";

import { Call } from "./dtos/call.interface";
import { ChamadosDto } from "./dtos/chamado.dto";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { LastSevenCallsDto } from "./dtos/lastSevenCalls.dto";
import { MessageDto } from "./dtos/message-dto";
import { QuestoesDto } from "./dtos/questoes.dto";
import { UpdateAllAvaliacaoDto } from "./dtos/update-all-avaliacao.dto";
import { UserAuthDto } from "./dtos/user-auth.dto";

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

export async function fetchCallsByIdTecnico(): Promise<ChamadosDto[]> {
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API;
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const response = await fetch(`${fileBaseUrl}/chamados/tecnico?idTecnico=`);

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: ChamadosDto[] = await response.json();

  return data;
}

export async function fetchAllCallsPaginated(): Promise<ChamadosDto[]> {
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API;
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const response = await fetch(`${fileBaseUrl}/chamados/paginated`);

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: ChamadosDto[] = await response.json();

  return data;
}

export async function findLastSevenCalls(): Promise<LastSevenCallsDto[]> {
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API;
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const response = await fetch(`${fileBaseUrl}/chamados/last-seven-calls`);

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: LastSevenCallsDto[] = await response.json();

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

export async function getLoggedUserByToken(
  token: string
): Promise<UserAuthDto> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API;
  const response = await fetch(`${fileBaseUrl}/auth/${token}`);

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: UserAuthDto = await response.json();
  return data;
}

export async function fetchMoreMessagesApi(
  operador: string,
  cnpj: string,
  id_mensagem: number | null,
  limit: number
): Promise<MessageDto[]> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API;
  const response = await fetch(
    `${fileBaseUrl}/messages/more-messages?operador=${operador}&cnpj=${cnpj}${
      id_mensagem ? `&id_mensagem=${id_mensagem}` : ""
    }&limit=${limit}`
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

  const response = await fetch(`${fileBaseUrl}/chamados/${chamado}`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: MessageDto = await response.json();
  return data;
}

export async function closeCallById(chamado: number): Promise<Call> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API;

  const response = await fetch(`${fileBaseUrl}/chamados/close/${chamado}`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: Call = await response.json();
  return data;
}

export async function closeCallWithoutTicket(
  chamado: number
): Promise<ChamadosDto> {
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

  const data: ChamadosDto = await response.json();
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
  console.log("REALIZANDO UPLOAD DO ARQUIVO - ", file, chamado.cnpj_operador);
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

export async function findQuestions(chamado: number): Promise<QuestoesDto[]> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API;

  const response = await fetch(`${fileBaseUrl}/avaliacao/${chamado}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  const data: QuestoesDto[] = await response.json();
  return data;
}

export async function sendAvaliation(
  questions: UpdateAllAvaliacaoDto[],
  idChamado: number
): Promise<any> {
  // Aqui você faz a lógica da API, por exemplo, uma chamada de fetch
  const fileBaseUrl = process.env.NEXT_PUBLIC_URL_API;

  const response = await fetch(
    `${fileBaseUrl}/avaliacao/all/${idChamado}`,

    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json", // <- ESSENCIAL
      },
      body: JSON.stringify(questions),
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao chamar a API");
  }

  return response.ok;
}
