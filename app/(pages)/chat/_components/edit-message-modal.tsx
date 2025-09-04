"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { MessageDto } from "../_actions/dtos/message-dto";

interface EditMessageModalProps {
  open: boolean;
  onClose: () => void;
  message?: MessageDto | null;
  onConfirm: (newText: string, idMessage: number) => void;
}

export default function EditMessageModal({
  open,
  onClose,
  message,
  onConfirm,
}: EditMessageModalProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (message) setText(message.mensagem);
    if (!open) setText(""); // limpa ao fechar
  }, [message, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-neutral-900 text-white max-w-md w-full p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Editar mensagem</h2>
          <button
            onClick={onClose}
            className="text-white font-bold text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Mensagem original */}
        {message && (
          <div className="p-3">
            <div className="bg-green-600 text-white px-3 py-2 rounded-lg inline-block max-w-[80%]">
              <span>{message.mensagem}</span>
              <span className="ml-2 text-xs opacity-70">
                {new Date(message.data).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        )}

        {/* Campo de edição */}
        <div className="flex items-center gap-2 p-3 border-t border-neutral-700">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none border-b border-green-500 focus:border-green-400 p-1"
            placeholder="Edite sua mensagem"
          />
          <button
            disabled={!message || !text.trim()}
            onClick={() => {
              if (message && text.trim()) {
                onConfirm(text, message.id_mensagem!);
                onClose();
              }
            }}
            className="bg-green-600 hover:bg-green-500 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
