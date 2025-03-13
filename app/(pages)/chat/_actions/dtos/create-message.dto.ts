export interface CreateMessageDto {
  id_chamado: number;
  mensagem: string;
  remetente: string;
  tecnico_responsavel: string | null;
}
