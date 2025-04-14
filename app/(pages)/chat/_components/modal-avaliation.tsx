import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog";
import { Star } from "lucide-react";
import { useState } from "react";
import { QuestoesDto } from "../_actions/dtos/questoes.dto";
interface AvaliationModalProps {
  questoes: QuestoesDto[];
  open: boolean;
  onClose: () => void;
  onSubmit: (respostas: { [id: string]: number }) => void;
}

export default function ModalAvaliation({
  questoes,
  open,
  onClose,
  onSubmit,
}: AvaliationModalProps) {
  const [answers, setAnswers] = useState<{ [id: string]: number }>({});

  const handleSelect = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSend = () => {
    onSubmit(answers);
    onClose();
  };

  const allAnswered =
    questoes.length > 0 &&
    questoes.every((q) => answers[q.id] && answers[q.id]! > 0);

  const renderRating = (questionId: string) => (
    <div className="flex gap-1 justify-start flex-wrap">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
        const selected = answers[questionId] ?? 0;
        const isFilled = num <= selected;

        return (
          <button
            key={num}
            onClick={() => handleSelect(questionId, num)}
            className="text-yellow-500 hover:scale-110 transition-transform"
          >
            {isFilled ? (
              <Star fill="currentColor" className="w-6 h-6" />
            ) : (
              <Star className="w-6 h-6" />
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md p-6 flex flex-col gap-6">
        <DialogTitle className="text-center text-lg font-bold">
          Avaliação
        </DialogTitle>

        <div className="flex flex-col gap-4">
          {questoes.map((questao, index) => {
            const perguntaFormatada =
              questao.pergunta!.charAt(0).toUpperCase() +
              questao.pergunta!.slice(1).toLowerCase();

            return (
              <div key={questao.id}>
                <p className="mb-2 text-sm font-medium">
                  {index + 1}. {perguntaFormatada}
                </p>
                {renderRating(questao.id)}
              </div>
            );
          })}
        </div>

        <Button className="mt-4" onClick={handleSend} disabled={!allAnswered}>
          Enviar Avaliação
        </Button>
      </DialogContent>
    </Dialog>
  );
}
