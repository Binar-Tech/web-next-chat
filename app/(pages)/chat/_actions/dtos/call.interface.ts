import { ChamadosDto } from "@/app/(pages)/home/_actions/api";
import { CallUser } from "./call-user.intarface";
import { User } from "./user.interface";

export interface Call {
  chamado: ChamadosDto;
  clientSocket?: User;
  technicianSockets?: CallUser[];
}
