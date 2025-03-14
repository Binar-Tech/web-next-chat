import { PerfilEnum } from "../../_services/enums/perfil.enum";

export interface CreateMessageDto {
  id_chamado: number;
  mensagem: string;
  remetente: PerfilEnum;
  tecnico_responsavel: string | null;
}
