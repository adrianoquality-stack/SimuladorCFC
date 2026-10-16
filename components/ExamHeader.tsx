'use client';

import React from 'react';
import {
  Timer,
  FileSpreadsheet,
  Calculator,
  HelpCircle,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Award,
  FileText,
} from 'lucide-react';
import { BookletType, BOOKLET_TYPES, EXAM_METADATA } from '@/lib/cfc-exam-data';

interface ExamHeaderProps {
  mode: 'exam' | 'practice';
  onToggleMode: (newMode: 'exam' | 'practice') => void;
  bookletType: BookletType;
  onChangeBookletType: (newType: BookletType) => void;
  onOpenBookletSelector?: () => void;
  secondsRemaining: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onOpenAnswerSheet: () => void;
  onOpenCalculator: () => void;
  onOpenInstructions: () => void;
  onFinishExam: () => void;
  onResetExam: () => void;
  answeredCount: number;
  totalQuestions: number;
  markedForReviewCount: number;
  isFinished: boolean;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  mode,
  onToggleMode,
  bookletType,
  onChangeBookletType,
  onOpenBookletSelector,
  secondsRemaining,
  isTimerRunning,
  onToggleTimer,
  onOpenAnswerSheet,
  onOpenCalculator,
  onOpenInstructions,
  onFinishExam,
  onResetExam,
  answeredCount,
  totalQuestions,
  markedForReviewCount,
  isFinished,
}) => {
  const [isBookletMenuOpen, setIsBookletMenuOpen] = React.useState(false);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isLowTime = secondsRemaining <= 1800; // 30 min ou menos
  const isCriticalTime = secondsRemaining <= 300; // 5 min ou menos
  const activeBooklet = BOOKLET_TYPES[bookletType] || BOOKLET_TYPES.tipo4;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Logo & Exam Info */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-xl tracking-tighter text-white shadow-inner">
              CFC
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-100">
                  {EXAM_METADATA.title}
                </span>

                {/* Booklet Type Selector Button */}
                <div className="relative">
                  <button
                    onClick={() => {
                      if (onOpenBookletSelector) {
                        onOpenBookletSelector();
                      } else {
                        setIsBookletMenuOpen((v) => !v);
                      }
                    }}
                    className={`text-xs px-3 py-1 rounded-lg border font-bold uppercase transition-all flex items-center gap-1.5 ${activeBooklet.badgeBg} hover:opacity-95 active:scale-95 shadow-sm`}
                    title="Clique para ver ou trocar a cor do caderno de prova (Branca, Verde, Amarela ou Azul)"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Caderno: Tipo {activeBooklet.number} ({activeBooklet.colorName})</span>
                    <span className="text-[10px] opacity-80 bg-black/20 px-1 py-0.2 rounded ml-1">Alterar</span>
                  </button>

                  {/* Dropdown Menu */}
                  {isBookletMenuOpen && (
                    <div className="absolute left-0 top-full mt-1.5 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 w-72 space-y-1 text-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 flex items-center justify-between">
                        <span>Selecione a Cor do Caderno:</span>
                        {onOpenBookletSelector && (
                          <button
                            onClick={() => {
                              setIsBookletMenuOpen(false);
                              onOpenBookletSelector();
                            }}
                            className="text-blue-400 hover:underline lowercase font-normal"
                          >
                            detalhes
                          </button>
                        )}
                      </div>
                      {(Object.keys(BOOKLET_TYPES) as BookletType[]).map((bKey) => {
                        const bConfig = BOOKLET_TYPES[bKey];
                        const isSelected = bookletType === bKey;
                        return (
                          <button
                            key={bKey}
                            onClick={() => {
                              onChangeBookletType(bKey);
                              setIsBookletMenuOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'hover:bg-slate-800 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-3 h-3 rounded-full border ${
                                  bKey === 'tipo1'
                                    ? 'bg-white border-slate-400'
                                    : bKey === 'tipo2'
                                    ? 'bg-emerald-500 border-emerald-400'
                                    : bKey === 'tipo3'
                                    ? 'bg-amber-400 border-amber-300'
                                    : 'bg-blue-500 border-blue-400'
                                }`}
                              />
                              <span>{bConfig.label}</span>
                            </div>
                            {isSelected && <span className="text-[10px] font-bold">Ativo</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded hidden sm:inline-block">
                  FGV Conhecimento
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Prova Objetiva Oficial • 50 Questões • Meta de Aprovação: 25 acertos (50%)
              </p>
            </div>
          </div>

          {/* Controls & Quick Actions */}
          <div className="flex items-center flex-wrap gap-2 justify-end">
            {/* Mode Switcher */}
            {!isFinished && (
              <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                <button
                  onClick={() => onToggleMode('exam')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                    mode === 'exam'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Modo Prova Real: Cronômetro de 4 horas e gabarito apenas após finalizar"
                >
                  <Award className="w-3.5 h-3.5" />
                  Prova Real
                </button>
                <button
                  onClick={() => onToggleMode('practice')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                    mode === 'practice'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Modo Treino: Veja resolução comentada e gabarito imediatamente a cada questão"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Treino / Comentado
                </button>
              </div>
            )}

            {/* Timer (Modo Prova) */}
            {mode === 'exam' && !isFinished && (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold transition-colors ${
                  isCriticalTime
                    ? 'bg-red-950/70 border-red-700 text-red-300 animate-pulse'
                    : isLowTime
                    ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <Timer className="w-4 h-4 text-slate-400" />
                <span>{formatTime(secondsRemaining)}</span>
                <button
                  onClick={onToggleTimer}
                  className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title={isTimerRunning ? 'Pausar cronômetro' : 'Retomar cronômetro'}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* Answer Sheet Button */}
            <button
              onClick={onOpenAnswerSheet}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
              <span>Cartão-Resposta</span>
              <span className="ml-1 bg-slate-700 px-1.5 py-0.2 rounded text-[10px] text-slate-300">
                {answeredCount}/{totalQuestions}
              </span>
            </button>

            {/* Calculator Button */}
            <button
              onClick={onOpenCalculator}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
              title="Calculadora de Apoio"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Calculadora</span>
            </button>

            {/* Instructions */}
            <button
              onClick={onOpenInstructions}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
              title="Instruções Oficiais da Prova Tipo 4"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Edital</span>
            </button>

            {/* Finish / Submit Button */}
            {!isFinished ? (
              <button
                onClick={onFinishExam}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Entregar Prova</span>
              </button>
            ) : (
              <button
                onClick={onResetExam}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refazer Simulado</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1 flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            title={`${answeredCount} respondidas`}
          />
          {markedForReviewCount > 0 && (
            <div
              className="bg-amber-400 h-full transition-all duration-300"
              style={{ width: `${(markedForReviewCount / totalQuestions) * 100}%` }}
              title={`${markedForReviewCount} marcadas para revisão`}
            />
          )}
        </div>
      </div>
    </header>
  );
};
