'use client';

import React, { useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Check,
  X,
  BookOpen,
  Sparkles,
  FileEdit,
  EyeOff,
  Eye,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  Calculator,
} from 'lucide-react';
import { BookletType, BOOKLET_TYPES, QuestionData } from '@/lib/cfc-exam-data';

interface QuestionCardProps {
  question: QuestionData;
  bookletNumber?: number;
  bookletType?: BookletType;
  selectedOption?: 'A' | 'B' | 'C' | 'D';
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
  isMarkedForReview: boolean;
  onToggleMarkForReview: () => void;
  mode: 'exam' | 'practice';
  isExamFinished: boolean;
  scratchNotes?: string;
  onOpenScratchpad: (questionId: number) => void;
  onOpenCalculator: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  bookletNumber,
  bookletType = 'tipo4',
  selectedOption,
  onSelectOption,
  isMarkedForReview,
  onToggleMarkForReview,
  mode,
  isExamFinished,
  scratchNotes,
  onOpenScratchpad,
  onOpenCalculator,
}) => {
  // Local state for struck-through / eliminated alternatives
  const [eliminatedOptions, setEliminatedOptions] = useState<Set<'A' | 'B' | 'C' | 'D'>>(new Set());
  const [showExplanation, setShowExplanation] = useState<boolean>(
    mode === 'practice' && !!selectedOption
  );

  const toggleEliminate = (letter: 'A' | 'B' | 'C' | 'D', e: React.MouseEvent) => {
    e.stopPropagation();
    setEliminatedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(letter)) {
        next.delete(letter);
      } else {
        next.add(letter);
      }
      return next;
    });
  };

  const isRevealed = isExamFinished || (mode === 'practice' && !!selectedOption);
  const isCorrect = selectedOption === question.correctOption;

  const difficultyColors = {
    Fácil: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    Médio: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    Difícil: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
      {/* Top Meta Header */}
      <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center justify-center font-black text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1 rounded-md tracking-wider">
            QUESTÃO {(bookletNumber || question.id).toString().padStart(2, '0')}
          </span>
          {bookletNumber && bookletNumber !== question.id && (
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              Ref. Tipo 4: Q.{question.id}
            </span>
          )}
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 px-2.5 py-0.5 rounded-full">
            {question.discipline}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            • {question.topic}
          </span>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
              difficultyColors[question.difficulty]
            }`}
          >
            {question.difficulty}
          </span>
        </div>

        {/* Card Utility Actions */}
        <div className="flex items-center gap-1.5">
          {/* Scratchpad note button */}
          <button
            onClick={() => onOpenScratchpad(question.id)}
            className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
              scratchNotes
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Anotações e cálculos desta questão"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {scratchNotes ? 'Ver Rascunho' : 'Rascunho'}
            </span>
          </button>

          {/* Calculator quick launch */}
          <button
            onClick={onOpenCalculator}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors hidden sm:flex items-center gap-1"
            title="Abrir Calculadora Financeira"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-500" />
            <span>Calc</span>
          </button>

          {/* Flag / Review button */}
          <button
            onClick={onToggleMarkForReview}
            className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
              isMarkedForReview
                ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Marcar questão para revisar depois"
          >
            {isMarkedForReview ? (
              <BookmarkCheck className="w-3.5 h-3.5" />
            ) : (
              <Bookmark className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {isMarkedForReview ? 'Marcada' : 'Revisar'}
            </span>
          </button>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Statement text */}
        <div className="text-slate-900 dark:text-slate-100 font-normal leading-relaxed text-base whitespace-pre-line tracking-normal">
          {question.statement}
        </div>

        {/* Structured Table if present */}
        {question.table && (
          <div className="overflow-x-auto my-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {question.table.headers.map((h, idx) => (
                    <th key={idx} className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-slate-800 dark:text-slate-200">
                {question.table.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`py-2 px-3 border-r border-slate-200 dark:border-slate-800 last:border-r-0 ${
                          cIdx === 0 ? 'font-sans font-medium text-slate-900 dark:text-slate-100' : ''
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Answer Options */}
        <div className="space-y-3 pt-2">
          {question.options.map((option) => {
            const isSelected = selectedOption === option.letter;
            const isEliminated = eliminatedOptions.has(option.letter);
            const isThisCorrect = option.letter === question.correctOption;

            // Compute styling based on mode and reveal status
            let borderClass = 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/40';
            let circleClass = 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800';

            if (isRevealed) {
              if (isThisCorrect) {
                borderClass = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500';
                circleClass = 'border-emerald-600 bg-emerald-600 text-white';
              } else if (isSelected && !isThisCorrect) {
                borderClass = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 ring-1 ring-rose-500';
                circleClass = 'border-rose-600 bg-rose-600 text-white';
              } else {
                borderClass = 'border-slate-200 dark:border-slate-800 opacity-60';
              }
            } else if (isSelected) {
              borderClass = 'border-blue-600 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 ring-1 ring-blue-500';
              circleClass = 'border-blue-600 bg-blue-600 text-white';
            }

            return (
              <div
                key={option.letter}
                onClick={() => {
                  if (!isEliminated) {
                    onSelectOption(option.letter);
                    if (mode === 'practice') {
                      setShowExplanation(true);
                    }
                  }
                }}
                className={`relative flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none group ${borderClass} ${
                  isEliminated ? 'opacity-40 grayscale line-through' : ''
                }`}
              >
                {/* Option Letter Indicator */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-colors ${circleClass}`}
                >
                  {isRevealed && isThisCorrect ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isRevealed && isSelected && !isThisCorrect ? (
                    <X className="w-4 h-4 stroke-[3]" />
                  ) : (
                    option.letter
                  )}
                </div>

                {/* Option Text */}
                <div className="flex-1 pt-0.5 text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200">
                  <span className={isEliminated ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                    {option.text}
                  </span>

                  {/* Feedback tag in revealed mode */}
                  {isRevealed && isThisCorrect && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded">
                      <CheckCircle className="w-3 h-3" /> Resposta Correta (Gabarito Oficial)
                    </span>
                  )}
                  {isRevealed && isSelected && !isThisCorrect && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 rounded">
                      <AlertCircle className="w-3 h-3" /> Sua Escolha Incorreta
                    </span>
                  )}
                </div>

                {/* Strikethrough / Elimination Tool Button */}
                {!isExamFinished && (
                  <button
                    onClick={(e) => toggleEliminate(option.letter, e)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                    title={isEliminated ? 'Restaurar alternativa' : 'Riscar / Eliminar alternativa'}
                  >
                    {isEliminated ? (
                      <Eye className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Practice Mode or Result Review Toggle Button */}
        {(mode === 'practice' || isExamFinished) && (
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>
                {showExplanation ? 'Ocultar Resolução Comentada' : 'Ver Resolução e Fundamentação'}
              </span>
            </button>
            {isRevealed && (
              <span className="text-xs text-slate-500 font-mono">
                Gabarito Oficial: <strong className="text-slate-800 dark:text-slate-200 font-bold">{question.correctOption}</strong>
              </span>
            )}
          </div>
        )}

        {/* Detailed Explanation / Resolution Box */}
        {showExplanation && (
          <div className="mt-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 text-slate-800 dark:text-slate-200 text-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                  Resolução Comentada & Fundamentação Técnica
                </span>
              </div>
              <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded text-xs">
                Opção Correta: {question.correctOption}
              </span>
            </div>

            {/* Summary */}
            <p className="font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
              {question.explanation.summary}
            </p>

            {/* Step-by-Step Points */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Passo a Passo / Análise das Alternativas:
              </div>
              <ul className="space-y-1.5 pl-4 list-disc text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                {question.explanation.stepByStep.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>

            {/* Formula / Calculation Box if exists */}
            {question.explanation.calculation && (
              <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800">
                <div className="text-amber-400 font-bold text-[11px] mb-1">
                  DEMONSTRAÇÃO DE CÁLCULO / MEMÓRIA:
                </div>
                <pre className="whitespace-pre-wrap">{question.explanation.calculation}</pre>
              </div>
            )}

            {/* Distractor explanations */}
            {question.explanation.distractors && (
              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Por que as demais alternativas estão incorretas:
                </span>
                <div className="space-y-1 mt-1">
                  {Object.entries(question.explanation.distractors).map(([opt, desc]) => (
                    <div key={opt}>
                      <strong className="text-slate-800 dark:text-slate-200">{opt}:</strong> {desc}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Normative Reference */}
            {question.explanation.normativeRef && (
              <div className="flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-lg border border-blue-200 dark:border-blue-900">
                <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  <strong>Fundamentação Legal / Normativa:</strong> {question.explanation.normativeRef}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
