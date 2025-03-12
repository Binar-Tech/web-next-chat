import { PerfilEnum } from "../enums/perfil.enum";

export interface LoginSocketDto {
  nome: string;
  cnpj?: string | null;
  type: PerfilEnum;
  id: string;
}
