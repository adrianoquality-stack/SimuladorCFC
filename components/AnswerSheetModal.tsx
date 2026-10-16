'use client';

import React from 'react';
import { X, CheckCircle, AlertCircle, Bookmark, Check } from 'lucide-react';
import { BookletType, BOOKLET_TYPES, CFC_EXAM_QUESTIONS, getBookletQuestions } from '@/lib/cfc-exam-data';

interface AnswerSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookletType: BookletType;
  onChangeBookletType: (type: BookletType) => void;
  answers: { [questionId: number]: 'A' | 'B' | 'C' | 'D' };
  onSelectAnswer: (questionId: number, option: 'A' | 'B' | 'C' | 'D') => void;
  reviewList: Set<number>;
  currentQuestionIndex: number;
  onNavigateToQuestion: (index: number) => void;
  onFinishExam: () => void;
  isExamFinished: boolean;
}

export const AnswerSheetModal: React.FC<AnswerSheetModalProps> = ({
  isOpen,
  onClose,
  bookletType,
  onChangeBookletType,
  answers,
  onSelectAnswer,
  reviewList,
  currentQuestionIndex,
  onNavigateToQuestion,
  onFinishExam,
  isExamFinished,
}) => {
  if (!isOpen) return null;

  const answeredCount = Object.keys(answers).length;
  const totalCount = CFC_EXAM_QUESTIONS.length;
  const unansweredCount = totalCount - answeredCount;
  const activeBooklet = BOOKLET_TYPES[bookletType] || BOOKLET_TYPES.tipo4;
  const bookletQuestions = getBookletQuestions(bookletType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow">
              CFC
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Cartão Oficial de Respostas (Folha Óptica)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Edital nº 01/2026 • Caderno {activeBooklet.label} • Preencha com caneta azul ou preta
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

        {/* Optical Booklet Type Bar (Simulating Official FGV Sheet) */}
        <div className="px-6 py-2.5 bg-slate-900 text-white border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-300">
              Tipo de Caderno (Marcação da Folha Óptica):
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(Object.keys(BOOKLET_TYPES) as BookletType[]).map((bKey) => {
              const b = BOOKLET_TYPES[bKey];
              const isSelected = bookletType === bKey;
              return (
                <button
                  key={bKey}
                  disabled={isExamFinished}
                  onClick={() => onChangeBookletType(bKey)}
                  className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 border-white shadow-md ring-2 ring-blue-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900'
                        : 'border-slate-500'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span>{b.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-900 dark:bg-slate-100 inline-block" />
              <span>{answeredCount} Respondidas</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-slate-500">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 inline-block" />
              <span>{unansweredCount} Em Branco</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
              <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{reviewList.size} Em Revisão</span>
            </div>
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
            Clique no número para ir até a questão correspondente
          </div>
        </div>

        {/* Bubble Grid (4 columns of 13/12 questions each) */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, colIdx) => {
              const start = colIdx * 13 + 1;
              const end = Math.min((colIdx + 1) * 13, 50);
              const items = [];
              for (let i = start; i <= end; i++) {
                items.push(i);
              }

              return (
                <div
                  key={colIdx}
                  className="bg-slate-50/70 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5"
                >
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-200 dark:border-slate-700 text-center">
                    Questões {start.toString().padStart(2, '0')} a {end.toString().padStart(2, '0')}
                  </div>
                  {items.map((qNum) => {
                    const bQ = bookletQuestions[qNum - 1];
                    const selected = answers[bQ.id];
                    const isReview = reviewList.has(bQ.id);
                    const isCurrent = currentQuestionIndex === qNum - 1;

                    return (
                      <div
                        key={qNum}
                        className={`flex items-center justify-between py-1 px-1.5 rounded-lg transition-colors ${
                          isCurrent
                            ? 'bg-blue-100 dark:bg-blue-950/60 ring-1 ring-blue-500'
                            : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/40'
                        }`}
                      >
                        {/* Question Number button */}
                        <button
                          onClick={() => {
                            onNavigateToQuestion(qNum - 1);
                            onClose();
                          }}
                          className="flex items-center gap-1 font-mono text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors w-10 text-left"
                        >
                          <span>{qNum.toString().padStart(2, '0')}</span>
                          {isReview && (
                            <Bookmark className="w-3 h-3 fill-amber-500 text-amber-500 flex-shrink-0" />
                          )}
                        </button>

                        {/* Optical bubbles A, B, C, D */}
                        <div className="flex items-center gap-1.5">
                          {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                            const isChosen = selected === letter;
                            const isCorrect = isExamFinished && letter === bQ.correctOption;
                            const isWrongChosen =
                              isExamFinished && isChosen && letter !== bQ.correctOption;

                            let bubbleClass =
                              'border-slate-400 dark:border-slate-500 hover:border-slate-800 dark:hover:border-slate-200 text-slate-700 dark:text-slate-300';

                            if (isExamFinished) {
                              if (isCorrect) {
                                bubbleClass = 'bg-emerald-600 border-emerald-600 text-white shadow-sm';
                              } else if (isWrongChosen) {
                                bubbleClass = 'bg-rose-600 border-rose-600 text-white shadow-sm';
                              } else {
                                bubbleClass = 'border-slate-300 opacity-40 text-slate-400';
                              }
                            } else if (isChosen) {
                              bubbleClass =
                                'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900 shadow-sm';
                            }

                            return (
                              <button
                                key={letter}
                                disabled={isExamFinished}
                                onClick={() => onSelectAnswer(bQ.id, letter)}
                                className={`w-6 h-6 rounded-full border text-[11px] font-bold flex items-center justify-center transition-all ${bubbleClass} ${
                                  !isExamFinished ? 'cursor-pointer active:scale-95' : 'cursor-default'
                                }`}
                                title={`Marcar opção ${letter} na questão ${qNum}`}
                              >
                                {isExamFinished && isCorrect ? (
                                  <Check className="w-3 h-3 stroke-[3]" />
                                ) : (
                                  letter
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {unansweredCount > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Atenção: Existem {unansweredCount} questão(ões) não preenchidas.
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Todas as 50 questões foram preenchidas no cartão!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors"
            >
              Continuar Respondendo
            </button>
            {!isExamFinished && (
              <button
                onClick={() => {
                  onClose();
                  onFinishExam();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow transition-transform active:scale-95"
              >
                Finalizar e Entregar Prova
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
