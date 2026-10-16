'use client';

import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  RotateCcw,
  BookOpen,
  Filter,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  BOOKLET_QUESTION_ORDER,
  BOOKLET_TYPES,
  BookletType,
  CFC_EXAM_QUESTIONS,
  EXAM_METADATA,
  QuestionData,
  getBookletQuestions,
} from '@/lib/cfc-exam-data';
import { QuestionCard } from './QuestionCard';

interface ExamResultsProps {
  answers: { [questionId: number]: 'A' | 'B' | 'C' | 'D' };
  bookletType?: BookletType;
  reviewList: Set<number>;
  totalSecondsSpent: number;
  onResetExam: () => void;
  onRedoIncorrect: (incorrectIds: number[]) => void;
  onOpenScratchpad: (id: number) => void;
  onOpenCalculator: () => void;
}

export const ExamResults: React.FC<ExamResultsProps> = ({
  answers,
  bookletType = 'tipo4',
  reviewList,
  totalSecondsSpent,
  onResetExam,
  onRedoIncorrect,
  onOpenScratchpad,
  onOpenCalculator,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect' | 'unanswered'>('all');
  const [showCorrespondenceTable, setShowCorrespondenceTable] = useState(false);
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);

  const activeBooklet = BOOKLET_TYPES[bookletType] || BOOKLET_TYPES.tipo4;
  const bookletQuestions = getBookletQuestions(bookletType);

  // Compute statistics
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  const incorrectQuestionIds: number[] = [];

  const disciplineStats: {
    [disc: string]: { total: number; correct: number };
  } = {};

  CFC_EXAM_QUESTIONS.forEach((q) => {
    if (!disciplineStats[q.discipline]) {
      disciplineStats[q.discipline] = { total: 0, correct: 0 };
    }
    disciplineStats[q.discipline].total += 1;

    const userAns = answers[q.id];
    if (!userAns) {
      unansweredCount += 1;
      incorrectQuestionIds.push(q.id);
    } else if (userAns === q.correctOption) {
      correctCount += 1;
      disciplineStats[q.discipline].correct += 1;
    } else {
      incorrectCount += 1;
      incorrectQuestionIds.push(q.id);
    }
  });

  const isApproved = correctCount >= EXAM_METADATA.passingScore;
  const percentage = Math.round((correctCount / EXAM_METADATA.totalQuestions) * 100);

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const avgSecondsPerQuestion = Math.round(totalSecondsSpent / EXAM_METADATA.totalQuestions);
  const avgMinutes = Math.floor(avgSecondsPerQuestion / 60);
  const avgSeconds = avgSecondsPerQuestion % 60;

  // Filter questions for detailed list
  const filteredQuestions = CFC_EXAM_QUESTIONS.filter((q) => {
    const userAns = answers[q.id];
    if (filterType === 'correct') return userAns === q.correctOption;
    if (filterType === 'incorrect') return !!userAns && userAns !== q.correctOption;
    if (filterType === 'unanswered') return !userAns;
    return true;
  });

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Status Hero Card */}
      <div
        className={`rounded-2xl p-6 sm:p-8 border shadow-lg relative overflow-hidden ${
          isApproved
            ? 'bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white border-emerald-600'
            : 'bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white border-rose-700'
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-left">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl border ${
                isApproved
                  ? 'bg-emerald-500 text-white border-emerald-300'
                  : 'bg-rose-600 text-white border-rose-400'
              }`}
            >
              <Award className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 mb-2">
                <span>Resultado Oficial CFC 2026.1</span>
                <span>•</span>
                <span className="text-amber-300 font-extrabold">{activeBooklet.label}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                {isApproved ? 'PARABÉNS! VOCÊ FOI APROVADO!' : 'NÃO FOI DESTA VEZ'}
              </h1>
              <p className="text-sm sm:text-base text-slate-200 mt-1 max-w-xl">
                {isApproved
                  ? `Você alcançou ${correctCount} pontos (mínimo de 25 necessários). Você atingiu os critérios para o Registro no Conselho Regional de Contabilidade (CRC)!`
                  : `Você atingiu ${correctCount} pontos. Para a aprovação oficial no exame do CFC são necessários no mínimo 25 pontos (faltaram ${25 - correctCount} acertos). Revise seus erros abaixo!`}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-black/30 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="text-center px-3">
              <span className="block text-3xl sm:text-4xl font-black font-mono">
                {correctCount}
              </span>
              <span className="text-[11px] font-bold text-slate-300 uppercase">
                Acertos (/50)
              </span>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center px-3">
              <span className="block text-3xl sm:text-4xl font-black font-mono text-amber-300">
                {percentage}%
              </span>
              <span className="text-[11px] font-bold text-slate-300 uppercase">Aproveitamento</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-300" />
              Tempo total: <strong>{formatTime(totalSecondsSpent)}</strong>
            </span>
            <span>•</span>
            <span>
              Média por questão: <strong>{avgMinutes}m {avgSeconds}s</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowCorrespondenceTable((v) => !v)}
              className="px-3.5 py-1.5 bg-blue-600/40 hover:bg-blue-600/60 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-blue-400/30 print:hidden"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{showCorrespondenceTable ? 'Ocultar Equivalência' : 'Equivalência dos 4 Cadernos'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors print:hidden"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / PDF
            </button>
            {incorrectQuestionIds.length > 0 && (
              <button
                onClick={() => onRedoIncorrect(incorrectQuestionIds)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow print:hidden"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Refazer {incorrectQuestionIds.length} Erradas
              </button>
            )}
            <button
              onClick={onResetExam}
              className="px-3.5 py-1.5 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow print:hidden"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Novo Simulado
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Correspondência entre os Tipos de Prova */}
      {showCorrespondenceTable && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Tabela Oficial de Correspondência entre os Tipos de Caderno (FGV)
              </h3>
              <p className="text-xs text-slate-500">
                Veja o número correspondente da mesma questão em cada um dos 4 tipos de caderno oficiais:
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded border border-blue-200 dark:border-blue-800">
              Caderno Atual: {activeBooklet.label}
            </span>
          </div>

          <div className="overflow-x-auto max-h-80 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 sticky top-0 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-700">Tipo 4 (Azul - Anexo)</th>
                  <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-700">Tipo 1 (Branca)</th>
                  <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-700">Tipo 2 (Verde)</th>
                  <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-700">Tipo 3 (Amarela)</th>
                  <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-700">Gabarito</th>
                  <th className="py-2 px-3">Disciplina</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
                {CFC_EXAM_QUESTIONS.map((q) => {
                  const numT1 = BOOKLET_QUESTION_ORDER.tipo1.indexOf(q.id) + 1;
                  const numT2 = BOOKLET_QUESTION_ORDER.tipo2.indexOf(q.id) + 1;
                  const numT3 = BOOKLET_QUESTION_ORDER.tipo3.indexOf(q.id) + 1;
                  const numT4 = q.id;

                  return (
                    <tr
                      key={q.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-1.5 px-3 font-bold border-r border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400">
                        Q.{numT4.toString().padStart(2, '0')}
                      </td>
                      <td className="py-1.5 px-3 border-r border-slate-200 dark:border-slate-800">
                        Q.{numT1.toString().padStart(2, '0')}
                      </td>
                      <td className="py-1.5 px-3 border-r border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400">
                        Q.{numT2.toString().padStart(2, '0')}
                      </td>
                      <td className="py-1.5 px-3 border-r border-slate-200 dark:border-slate-800 text-amber-600 dark:text-amber-400">
                        Q.{numT3.toString().padStart(2, '0')}
                      </td>
                      <td className="py-1.5 px-3 font-bold border-r border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                        {q.correctOption}
                      </td>
                      <td className="py-1.5 px-3 font-sans text-slate-600 dark:text-slate-400">
                        {q.discipline}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disciplines Performance Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Diagnóstico de Desempenho por Disciplina
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Baseado nas 50 questões da Prova Tipo 4 do CFC
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(disciplineStats).map(([disc, stats]) => {
            const discPercentage = Math.round((stats.correct / stats.total) * 100);
            const isGood = discPercentage >= 60;
            const isMedium = discPercentage >= 50 && discPercentage < 60;

            return (
              <div
                key={disc}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{disc}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {stats.correct}/{stats.total} ({discPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isGood ? 'bg-emerald-500' : isMedium ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${discPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Review Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Gabarito Comentado e Análise Questão por Questão
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Todas (50)
            </button>
            <button
              onClick={() => setFilterType('correct')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'correct'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Acertos ({correctCount})
            </button>
            <button
              onClick={() => setFilterType('incorrect')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'incorrect'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Erros ({incorrectCount})
            </button>
            {unansweredCount > 0 && (
              <button
                onClick={() => setFilterType('unanswered')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === 'unanswered'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Em Branco ({unansweredCount})
              </button>
            )}
          </div>
        </div>

        {/* Questions Detailed Accordion / Cards */}
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const userChoice = answers[q.id];
            const isCorrect = userChoice === q.correctOption;
            const isExpanded = expandedQuestionId === q.id;

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : userChoice
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {q.id.toString().padStart(2, '0')}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          Questão {q.id}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          • {q.discipline}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                        {q.topic}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span>
                        Sua: <strong>{userChoice || '—'}</strong>
                      </span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        Gabarito: <strong>{q.correctOption}</strong>
                      </span>
                    </div>

                    {isCorrect ? (
                      <span className="p-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        <XCircle className="w-4 h-4" />
                      </span>
                    )}

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded full question resolution */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <QuestionCard
                      question={q}
                      selectedOption={userChoice}
                      onSelectOption={() => {}}
                      isMarkedForReview={reviewList.has(q.id)}
                      onToggleMarkForReview={() => {}}
                      mode="practice"
                      isExamFinished={true}
                      onOpenScratchpad={onOpenScratchpad}
                      onOpenCalculator={onOpenCalculator}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
