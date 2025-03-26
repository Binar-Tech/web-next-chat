import { TecnicoDto } from "./tecnico.dto";

export interface ReturnChamadoDto {
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
  nome_tecnico?: string;
  tecnico?: TecnicoDto;
}
