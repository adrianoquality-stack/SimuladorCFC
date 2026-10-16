'use client';

import React from 'react';
import { X, Check, FileText, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { BookletType, BOOKLET_TYPES, BOOKLET_QUESTION_ORDER } from '@/lib/cfc-exam-data';

interface BookletSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBooklet: BookletType;
  onSelectBooklet: (type: BookletType) => void;
  isExamFinished?: boolean;
}

export const BookletSelectorModal: React.FC<BookletSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedBooklet,
  onSelectBooklet,
  isExamFinished = false,
}) => {
  if (!isOpen) return null;

  const bookletList = (Object.keys(BOOKLET_TYPES) as BookletType[]).map((key) => BOOKLET_TYPES[key]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Selecione o Tipo de Caderno de Prova
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                FGV Conhecimento • Exame de Suficiência CFC 2026.1 • 4 Cores Oficiais
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl p-3.5 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Como funciona a escolha do tipo de caderno?</p>
              <p className="text-slate-600 dark:text-blue-300">
                Todas as 4 cores possuem exatamente as mesmas 50 questões do edital, porém dispostas em ordens diferentes para impedir cópia em sala de prova. Você pode alterar a cor a qualquer momento sem perder suas respostas marcadas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {bookletList.map((b) => {
              const isSelected = selectedBooklet === b.id;
              const q1OriginalId = BOOKLET_QUESTION_ORDER[b.id][0];

              return (
                <div
                  key={b.id}
                  onClick={() => {
                    onSelectBooklet(b.id);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                    isSelected
                      ? `${b.borderColor} bg-blue-50/60 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500`
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  {b.id === 'tipo4' && (
                    <span className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      Caderno do Anexo
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-4 h-4 rounded-full border-2 ${
                            b.id === 'tipo1'
                              ? 'bg-white border-slate-400'
                              : b.id === 'tipo2'
                              ? 'bg-emerald-500 border-emerald-400'
                              : b.id === 'tipo3'
                              ? 'bg-amber-400 border-amber-300'
                              : 'bg-blue-600 border-blue-400'
                          }`}
                        />
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {b.label}
                        </span>
                      </div>
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Selecionado
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Clique para ativar</span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                      {b.description}
                    </p>

                    <div className="text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800/80 p-2 rounded-lg space-y-0.5 font-mono">
                      <div>Q.01 deste caderno = Q.{q1OriginalId} da Prova Tipo 4</div>
                      <div className="text-[10px] text-slate-400 font-sans">
                        50 questões com gabarito oficial e comentários
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBooklet(b.id);
                      onClose();
                    }}
                    className={`mt-3 w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isSelected ? 'Caderno Ativo' : 'Escolher este Caderno'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Caderno em uso: <strong className="text-slate-900 dark:text-white">{BOOKLET_TYPES[selectedBooklet].label}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Confirmar e Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
