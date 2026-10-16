'use client';

import React from 'react';
import { Bookmark, Check, ChevronLeft, ChevronRight, Filter, FileText, ChevronDown } from 'lucide-react';
import {
  BookletQuestion,
  BookletType,
  BOOKLET_TYPES,
  CFC_EXAM_QUESTIONS,
  DISCIPLINES,
} from '@/lib/cfc-exam-data';

interface QuestionNavigatorProps {
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  questions?: BookletQuestion[];
  bookletType?: BookletType;
  onChangeBookletType?: (type: BookletType) => void;
  onOpenBookletSelector?: () => void;
  answers: { [questionId: number]: 'A' | 'B' | 'C' | 'D' };
  reviewList: Set<number>;
  selectedDiscipline: string;
  onSelectDiscipline: (discipline: string) => void;
  isExamFinished: boolean;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  currentIndex,
  onSelectIndex,
  questions = CFC_EXAM_QUESTIONS as unknown as BookletQuestion[],
  bookletType = 'tipo4',
  onChangeBookletType,
  onOpenBookletSelector,
  answers,
  reviewList,
  selectedDiscipline,
  onSelectDiscipline,
  isExamFinished,
}) => {
  const activeBooklet = BOOKLET_TYPES[bookletType] || BOOKLET_TYPES.tipo4;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
      {/* Booklet Type Selector Box (Prominent & Clear) */}
      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Tipo de Prova (FGV)</span>
          </div>
          {onOpenBookletSelector && (
            <button
              onClick={onOpenBookletSelector}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              <span>Ver detalhes</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* 4 Booklet Buttons */}
        <div className="grid grid-cols-4 gap-1">
          {(Object.keys(BOOKLET_TYPES) as BookletType[]).map((bKey) => {
            const b = BOOKLET_TYPES[bKey];
            const isSelected = bookletType === bKey;
            return (
              <button
                key={bKey}
                onClick={() => onChangeBookletType?.(bKey)}
                title={b.description}
                className={`py-1.5 px-1 rounded-md text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 border transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-102 ring-1 ring-blue-400'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full border ${
                      bKey === 'tipo1'
                        ? 'bg-white border-slate-400'
                        : bKey === 'tipo2'
                        ? 'bg-emerald-400 border-emerald-300'
                        : bKey === 'tipo3'
                        ? 'bg-amber-300 border-amber-400'
                        : 'bg-blue-300 border-blue-400'
                    }`}
                  />
                  <span>T{b.number}</span>
                </div>
                <span className={`text-[9px] font-normal truncate max-w-full ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                  {b.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Caderno ativo: <strong>{activeBooklet.label}</strong></span>
          {bookletType === 'tipo4' && (
            <span className="text-[9px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold px-1.5 py-0.2 rounded">
              Anexo Oficial
            </span>
          )}
        </div>
      </div>

      {/* Category / Discipline Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Filtrar por Disciplina</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {DISCIPLINES.map((d) => (
            <button
              key={d}
              onClick={() => onSelectDiscipline(d)}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors ${
                selectedDiscipline === d
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 50 Questions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <span>Navegação pelas Questões (1 a 50)</span>
          <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">
            {currentIndex + 1} de {CFC_EXAM_QUESTIONS.length}
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 max-h-56 overflow-y-auto p-1 border border-slate-100 dark:border-slate-800 rounded-lg">
          {questions.map((q, idx) => {
            const bookletNum = idx + 1;
            const isAnswered = !!answers[q.id];
            const isReview = reviewList.has(q.id);
            const isCurrent = currentIndex === idx;
            const matchesFilter =
              selectedDiscipline === 'Todas' || q.discipline === selectedDiscipline;

            let btnClass = 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

            if (isExamFinished) {
              const isCorrect = answers[q.id] === q.correctOption;
              if (isCorrect) {
                btnClass = 'bg-emerald-600 text-white border-emerald-700';
              } else if (isAnswered) {
                btnClass = 'bg-rose-600 text-white border-rose-700';
              } else {
                btnClass = 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-dashed border-slate-300';
              }
            } else if (isAnswered) {
              btnClass = 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-900 dark:border-white font-bold';
            }

            if (isCurrent) {
              btnClass += ' ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-slate-900 z-10';
            }

            if (!matchesFilter) {
              btnClass += ' opacity-25';
            }

            return (
              <button
                key={q.id}
                onClick={() => onSelectIndex(idx)}
                className={`relative h-8 rounded-md text-xs font-mono font-semibold border flex items-center justify-center transition-all ${btnClass} hover:scale-105 active:scale-95`}
                title={`Questão ${bookletNum} (Ref. Q.${q.id}) - ${q.discipline}`}
              >
                <span>{bookletNum}</span>
                {isReview && !isExamFinished && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-1 ring-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons (Prev / Next) */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => onSelectIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="flex-1 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>
        <button
          onClick={() => onSelectIndex(Math.min(CFC_EXAM_QUESTIONS.length - 1, currentIndex + 1))}
          disabled={currentIndex === CFC_EXAM_QUESTIONS.length - 1}
          className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 transition-colors shadow-sm"
        >
          <span>Próxima</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-800 dark:bg-slate-200 inline-block" />
          <span>Marcada</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 inline-block" />
          <span>Branca</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          <span>Revisão</span>
        </div>
      </div>
    </div>
  );
};
