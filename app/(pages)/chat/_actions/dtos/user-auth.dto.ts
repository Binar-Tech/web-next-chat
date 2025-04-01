import { PerfilEnum } from "../../_services/enums/perfil.enum";

export interface UserAuthDto {
  id: string;
  nome: string;
  cnpj?: string | null;
  type: PerfilEnum;
  link_operador?: string | null;
}
