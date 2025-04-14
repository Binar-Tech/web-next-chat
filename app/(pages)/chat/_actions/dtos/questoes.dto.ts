export interface QuestoesDto {
  id: string;
  nota: number;
  fk_suporte_avaliacao: string;
  fk_ticket: string;
  idn_email: string;
  id_chamado: number;
  data_update: string;
  data_insert: string;
  pergunta?: string | null;
}
