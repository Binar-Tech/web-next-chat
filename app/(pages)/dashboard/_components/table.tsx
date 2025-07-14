import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { formatDateTime } from "@/app/utils/data";
import { ChamadosDto } from "../../chat/_actions/dtos/chamado.dto";
import { StatusBadge } from "./statusBadge";

type TableLastCallsProps = {
  calls: ChamadosDto[] | null;
};

export function TableLastCalls({ calls }: TableLastCallsProps) {
  return (
    <Table className="text-[.6rem] xl:text-sm">
      <TableCaption>Últimos chamados abertos</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Código</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Técnico Responsável</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Operador</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calls?.map((call) => {
          return (
            <TableRow key={call.id_chamado}>
              <TableCell>{call.id_chamado}</TableCell>
              <TableCell>
                <StatusBadge status={call.status} />
              </TableCell>
              <TableCell>{formatDateTime(call.data_abertura)}</TableCell>
              <TableCell>{call.tecnico?.name}</TableCell>
              <TableCell>{call.empresa?.fantasia ?? ""}</TableCell>
              <TableCell>{call.nome_operador}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
