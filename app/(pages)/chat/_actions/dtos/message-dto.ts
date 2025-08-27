export interface MessageDto {
  id_mensagem: number;
  id_chamado: number;
  data: string;
  mensagem: string;
  nome_arquivo: string;
  caminho_arquivo_ftp: string;
  remetente: string;
  id_tecnico: string;
  tecnico_responsavel: string;
  nome_tecnico?: string;
  system_message?: boolean;
  avaliation_buttons?: boolean;
  message_reply?: MessageDto | null;
}
