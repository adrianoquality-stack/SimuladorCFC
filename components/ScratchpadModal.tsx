'use client';

import React from 'react';
import { X, Save, Trash2, Edit3 } from 'lucide-react';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: number;
  note: string;
  onSaveNote: (questionId: number, note: string) => void;
}

export const ScratchpadModal: React.FC<ScratchpadModalProps> = ({
  isOpen,
  onClose,
  questionId,
  note,
  onSaveNote,
}) => {
  const [prevQuestionId, setPrevQuestionId] = React.useState(questionId);
  const [currentText, setCurrentText] = React.useState(note);

  if (questionId !== prevQuestionId) {
    setPrevQuestionId(questionId);
    setCurrentText(note);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-amber-50 dark:bg-amber-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="font-bold text-sm text-amber-900 dark:text-amber-200">
              Rascunho do Candidato — Questão {questionId.toString().padStart(2, '0')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Utilize este espaço para rabiscar cálculos de contas, partidas dobradas, taxas de juros ou anotações conceituais desta questão.
          </p>
          <textarea
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder="Exemplo de cálculo:
Amortização SAC = 240.000 / 30 = 8.000
SD4 = 240.000 - 4*8.000 = 208.000
Juros 5 = 4% de 208.000 = 8.320
Parcela 5 = 8.000 + 8.320 = 16.320..."
            rows={8}
            className="w-full p-3 font-mono text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-y"
          />
        </div>

        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentText('');
              onSaveNote(questionId, '');
            }}
            className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpar Rascunho
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                onSaveNote(questionId, currentText);
                onClose();
              }}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-transform active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar Anotação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
