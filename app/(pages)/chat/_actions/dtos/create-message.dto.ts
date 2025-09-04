import { PerfilEnum } from "../../_services/enums/perfil.enum";

export interface CreateMessageDto {
  id_chamado: number;
  mensagem: string | null;
  remetente: PerfilEnum;
  nome_arquivo?: string | null;
  tecnico_responsavel?: string | null;
  caminho_arquivo_ftp?: string | null;
  id_mensagem_reply?: number | null;
}
