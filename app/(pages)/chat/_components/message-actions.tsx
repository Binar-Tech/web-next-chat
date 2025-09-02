import { Button } from "@/app/components/ui/button";

interface Props {
  onCustomAction?: (flag: boolean) => void;
}

export default function MessageActions({ onCustomAction }: Props) {
  return (
    <div className="flex flex-row items-center justify-center gap-2 pt-4">
      <Button className="flex flex-1" onClick={() => onCustomAction?.(true)}>
        Avaliar
      </Button>
      <Button
        className="bg-red-700 hover:bg-red-600 flex flex-1"
        onClick={() => onCustomAction?.(false)}
      >
        Agora não!
      </Button>
    </div>
  );
}
