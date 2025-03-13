import { CallUser } from "./call-user.intarface";
import { ReturnChamadoDto } from "./returnChamado.dto";
import { User } from "./user.interface";

export interface Call {
  chamado: ReturnChamadoDto;
  clientSocket?: User;
  technicianSockets?: CallUser[];
}
