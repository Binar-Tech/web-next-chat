import { Badge } from "@/app/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  let label = status;

  switch (status) {
    case "ABERTO":
      variant = "default"; // azul padrão
      break;
    case "FECHADO":
      variant = "secondary"; // cinza
      break;
    case "AVALIAR":
      variant = "destructive"; // vermelho
      break;
    default:
      variant = "outline"; // fallback
  }

  return <Badge variant={variant}>{label}</Badge>;
}
