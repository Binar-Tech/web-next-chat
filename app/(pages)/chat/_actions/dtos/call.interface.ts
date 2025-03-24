import { CallUser } from "./call-user.intarface";
import { ChamadosDto } from "./chamado.dto";
import { User } from "./user.interface";

export interface Call {
  chamado: ChamadosDto;
  clientSocket?: User;
  technicianSockets?: CallUser[];
}
