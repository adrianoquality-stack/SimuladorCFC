'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Award,
  BookOpen,
  Clock,
  FileCheck2,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
  Calculator,
  FileText,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Layers,
} from 'lucide-react';
import {
  CFC_EXAM_QUESTIONS,
  EXAM_METADATA,
  DISCIPLINES,
  BookletType,
  BOOKLET_TYPES,
  getBookletQuestions,
  BookletQuestion,
} from '@/lib/cfc-exam-data';
import { ExamHeader } from '@/components/ExamHeader';
import { QuestionCard } from '@/components/QuestionCard';
import { QuestionNavigator } from '@/components/QuestionNavigator';
import { AnswerSheetModal } from '@/components/AnswerSheetModal';
import { CalculatorModal } from '@/components/CalculatorModal';
import { InstructionsModal } from '@/components/InstructionsModal';
import { ScratchpadModal } from '@/components/ScratchpadModal';
import { ExamResults } from '@/components/ExamResults';
import { BookletSelectorModal } from '@/components/BookletSelectorModal';

export default function Home() {
  // Booklet Type: Tipo 1 (Branca), Tipo 2 (Verde), Tipo 3 (Amarela), Tipo 4 (Azul - Caderno do Anexo)
  const [bookletType, setBookletType] = useState<BookletType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cfc_sim_booklet_type');
      if (saved && ['tipo1', 'tipo2', 'tipo3', 'tipo4'].includes(saved)) {
        return saved as BookletType;
      }
    }
    return 'tipo4';
  });

  // Simulator State initialized lazily from localStorage
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('cfc_sim_finished') === 'true' ||
        localStorage.getItem('cfc_sim_started') === 'true'
      );
    }
    return false;
  });
  const [mode, setMode] = useState<'exam' | 'practice'>('exam');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [qId: number]: 'A' | 'B' | 'C' | 'D' }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cfc_sim_answers');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Ignore
        }
      }
    }
    return {};
  });
  const [reviewList, setReviewList] = useState<Set<number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cfc_sim_review');
      if (saved) {
        try {
          return new Set(JSON.parse(saved));
        } catch {
          // Ignore
        }
      }
    }
    return new Set();
  });
  const [scratchNotes, setScratchNotes] = useState<{ [qId: number]: string }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cfc_sim_notes');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Ignore
        }
      }
    }
    return {};
  });
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('Todas');
  const [isFinished, setIsFinished] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cfc_sim_finished') === 'true';
    }
    return false;
  });

  // Timer: 4 hours (14400 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cfc_sim_time');
      if (saved) {
        const secs = parseInt(saved, 10);
        if (!isNaN(secs)) return secs;
      }
    }
    return EXAM_METADATA.durationMinutes * 60;
  });
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [totalSecondsSpent, setTotalSecondsSpent] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cfc_sim_time');
      if (saved) {
        const secs = parseInt(saved, 10);
        if (!isNaN(secs)) return EXAM_METADATA.durationMinutes * 60 - secs;
      }
    }
    return 0;
  });

  // Modals
  const [isBookletSelectorOpen, setIsBookletSelectorOpen] = useState<boolean>(false);
  const [isAnswerSheetOpen, setIsAnswerSheetOpen] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);
  const [activeScratchQuestionId, setActiveScratchQuestionId] = useState<number | null>(null);
  const [showConfirmFinishModal, setShowConfirmFinishModal] = useState<boolean>(false);

  // Save state on change
  useEffect(() => {
    if (hasStarted) {
      try {
        localStorage.setItem('cfc_sim_booklet_type', bookletType);
        localStorage.setItem('cfc_sim_answers', JSON.stringify(answers));
        localStorage.setItem('cfc_sim_review', JSON.stringify(Array.from(reviewList)));
        localStorage.setItem('cfc_sim_notes', JSON.stringify(scratchNotes));
        localStorage.setItem('cfc_sim_time', secondsRemaining.toString());
        localStorage.setItem('cfc_sim_finished', isFinished.toString());
      } catch {
        // Ignore
      }
    }
  }, [hasStarted, bookletType, answers, reviewList, scratchNotes, secondsRemaining, isFinished]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && !isFinished && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
        setTotalSecondsSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isFinished, secondsRemaining]);

  const activeBooklet = BOOKLET_TYPES[bookletType] || BOOKLET_TYPES.tipo4;
  const bookletQuestions = useMemo(() => getBookletQuestions(bookletType), [bookletType]);
  const currentQuestion = bookletQuestions[currentIndex] || bookletQuestions[0];

  // Keyboard navigation & shortcuts (A, B, C, D, Left, Right)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        isAnswerSheetOpen ||
        isCalculatorOpen ||
        isInstructionsOpen ||
        activeScratchQuestionId !== null ||
        showConfirmFinishModal
      ) {
        return;
      }

      // Ignore when user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const currentQ = bookletQuestions[currentIndex];
      if (!currentQ) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentIndex((i) => Math.min(bookletQuestions.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (['a', 'A', '1'].includes(e.key)) {
        if (!isFinished) setAnswers((prev) => ({ ...prev, [currentQ.id]: 'A' }));
      } else if (['b', 'B', '2'].includes(e.key)) {
        if (!isFinished) setAnswers((prev) => ({ ...prev, [currentQ.id]: 'B' }));
      } else if (['c', 'C', '3'].includes(e.key)) {
        if (!isFinished) setAnswers((prev) => ({ ...prev, [currentQ.id]: 'C' }));
      } else if (['d', 'D', '4'].includes(e.key)) {
        if (!isFinished) setAnswers((prev) => ({ ...prev, [currentQ.id]: 'D' }));
      }
    },
    [
      currentIndex,
      bookletQuestions,
      isFinished,
      isAnswerSheetOpen,
      isCalculatorOpen,
      isInstructionsOpen,
      activeScratchQuestionId,
      showConfirmFinishModal,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleStartExam = (selectedMode: 'exam' | 'practice') => {
    setMode(selectedMode);
    setHasStarted(true);
    setIsFinished(false);
    if (selectedMode === 'exam') {
      setIsTimerRunning(true);
    }
  };

  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    const currentQ = bookletQuestions[currentIndex];
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const handleToggleMarkForReview = () => {
    const currentQ = bookletQuestions[currentIndex];
    if (!currentQ) return;
    setReviewList((prev) => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) {
        next.delete(currentQ.id);
      } else {
        next.add(currentQ.id);
      }
      return next;
    });
  };

  const handleFinishExamPrompt = () => {
    setShowConfirmFinishModal(true);
  };

  const handleConfirmFinish = () => {
    setShowConfirmFinishModal(false);
    setIsFinished(true);
    setIsTimerRunning(false);
  };

  const handleResetExam = () => {
    if (confirm('Deseja realmente reiniciar todo o simulado e limpar as respostas?')) {
      setAnswers({});
      setReviewList(new Set());
      setScratchNotes({});
      setSecondsRemaining(EXAM_METADATA.durationMinutes * 60);
      setTotalSecondsSpent(0);
      setIsFinished(false);
      setIsTimerRunning(mode === 'exam');
      setCurrentIndex(0);
      try {
        localStorage.removeItem('cfc_sim_answers');
        localStorage.removeItem('cfc_sim_review');
        localStorage.removeItem('cfc_sim_notes');
        localStorage.removeItem('cfc_sim_time');
        localStorage.removeItem('cfc_sim_finished');
      } catch {
        // Ignore
      }
    }
  };

  const handleRedoIncorrect = (incorrectIds: number[]) => {
    // Reset answers for incorrect only
    const newAnswers = { ...answers };
    incorrectIds.forEach((id) => delete newAnswers[id]);
    setAnswers(newAnswers);
    setIsFinished(false);
    setMode('practice'); // Switch to practice mode for reviewing missed ones
    const firstIncorrectIndex = bookletQuestions.findIndex((q) =>
      incorrectIds.includes(q.id)
    );
    if (firstIncorrectIndex !== -1) {
      setCurrentIndex(firstIncorrectIndex);
    }
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Exam Header */}
      {hasStarted && (
        <ExamHeader
          mode={mode}
          onToggleMode={(newMode) => {
            setMode(newMode);
            if (newMode === 'exam') setIsTimerRunning(true);
            else setIsTimerRunning(false);
          }}
          bookletType={bookletType}
          onChangeBookletType={(newType) => setBookletType(newType)}
          onOpenBookletSelector={() => setIsBookletSelectorOpen(true)}
          secondsRemaining={secondsRemaining}
          isTimerRunning={isTimerRunning}
          onToggleTimer={() => setIsTimerRunning((v) => !v)}
          onOpenAnswerSheet={() => setIsAnswerSheetOpen(true)}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenInstructions={() => setIsInstructionsOpen(true)}
          onFinishExam={handleFinishExamPrompt}
          onResetExam={handleResetExam}
          answeredCount={answeredCount}
          totalQuestions={bookletQuestions.length}
          markedForReviewCount={reviewList.size}
          isFinished={isFinished}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!hasStarted ? (
          /* Welcome & Exam Start Screen */
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-6">
            {/* Header Hero */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Edital Oficial nº 01/2026 • Prova Objetiva Tipo 4 • FGV
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Simulador do Exame de Suficiência <span className="text-emerald-600 dark:text-emerald-400">CFC 2026.1</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Pratique com as <strong>50 questões integrais</strong> do caderno oficial da FGV. Simulação fiel com folha de respostas óptica, cronômetro de 4 horas, calculadora e gabarito 100% comentado.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <span className="block text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                  50
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Questões Objetivas
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <span className="block text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  25
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Pontos p/ Aprovação (50%)
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <span className="block text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                  04:00
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Horas de Duração Oficial
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <span className="block text-2xl sm:text-3xl font-black text-amber-500 font-mono">
                  100%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Comentadas & Fundamentadas
                </span>
              </div>
            </div>

            {/* Booklet Type Selector (Tipo de Prova - OBRIGATÓRIO FGV) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Tipo de Caderno de Prova (FGV Conhecimento)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Selecione qual cor de prova deseja realizar. Todas possuem as 50 questões integrais em ordens oficiais distintas:
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Selecionado: <strong className="text-blue-600 dark:text-blue-400">{activeBooklet.label}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(Object.keys(BOOKLET_TYPES) as BookletType[]).map((bKey) => {
                  const b = BOOKLET_TYPES[bKey];
                  const isSelected = bookletType === bKey;
                  return (
                    <div
                      key={bKey}
                      onClick={() => setBookletType(bKey)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                        isSelected
                          ? `${b.borderColor} bg-slate-50 dark:bg-slate-800/80 shadow-md ring-2 ring-offset-1 ring-blue-500`
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      {bKey === 'tipo4' && (
                        <span className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                          Caderno do Anexo
                        </span>
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`w-3.5 h-3.5 rounded-full border ${
                              bKey === 'tipo1'
                                ? 'bg-white border-slate-400'
                                : bKey === 'tipo2'
                                ? 'bg-emerald-500 border-emerald-400'
                                : bKey === 'tipo3'
                                ? 'bg-amber-400 border-amber-300'
                                : 'bg-blue-600 border-blue-400'
                            }`}
                          />
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            Tipo {b.number} - {b.colorName}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                          {b.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                        <span className={isSelected ? 'text-blue-600 font-bold' : 'text-slate-400'}>
                          {isSelected ? '✓ Selecionado' : 'Clique p/ Escolher'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mode Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Option 1: Real Exam Mode */}
              <div
                onClick={() => handleStartExam('exam')}
                className="group relative p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-500/40 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      Modo Prova Real (Oficial)
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      Condição real idêntica ao dia da prova: cronômetro regressivo de 4 horas, marcação no Cartão-Resposta do Caderno {activeBooklet.colorName}, e resultado revelado apenas ao entregar o caderno.
                    </p>
                  </div>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 list-disc pl-4">
                    <li>Controle de tempo estrito de 4 horas</li>
                    <li>Cartão de respostas óptico interativo</li>
                    <li>Diagnóstico final de Aprovação no CFC</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-blue-600 dark:text-blue-400 font-bold text-sm">
                  <span>Iniciar Simulado Prova Real</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Option 2: Practice / Study Mode */}
              <div
                onClick={() => handleStartExam('practice')}
                className="group relative p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                      Modo Estudo com Resolução Imediata
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      Responda no seu próprio ritmo com feedback instantâneo, visualizando a resolução comentada passo a passo, memória de cálculo e normas técnicas (NBCs/Leis).
                    </p>
                  </div>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 list-disc pl-4">
                    <li>Sem pressão de tempo do relógio</li>
                    <li>Gabarito e fundamentação normativa a cada questão</li>
                    <li>Eliminação de alternativas e anotações</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <span>Começar no Modo Estudo</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Disciplines Covered */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Disciplinas Contempladas neste Simulado Oficial (50 Questões)
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {DISCIPLINES.filter((d) => d !== 'Todas').map((d) => (
                  <div
                    key={d}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 font-medium text-slate-700 dark:text-slate-300"
                  >
                    • {d}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : isFinished ? (
          /* Finished Results & Diagnostics */
          <ExamResults
            answers={answers}
            bookletType={bookletType}
            reviewList={reviewList}
            totalSecondsSpent={totalSecondsSpent}
            onResetExam={handleResetExam}
            onRedoIncorrect={handleRedoIncorrect}
            onOpenScratchpad={(qId) => setActiveScratchQuestionId(qId)}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
          />
        ) : (
          /* Active Exam View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Active Question (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Active Booklet Notification Bar */}
              <div className="flex flex-wrap items-center justify-between px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border ${activeBooklet.borderColor} ${
                      activeBooklet.id === 'tipo1'
                        ? 'bg-white border-slate-400'
                        : activeBooklet.id === 'tipo2'
                        ? 'bg-emerald-500 border-emerald-400'
                        : activeBooklet.id === 'tipo3'
                        ? 'bg-amber-400 border-amber-300'
                        : 'bg-blue-600 border-blue-400'
                    }`}
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300">
                    Caderno Oficial Ativo: <strong className="text-slate-900 dark:text-white font-bold">{activeBooklet.label}</strong> (FGV)
                  </span>
                </div>
                <button
                  onClick={() => setIsBookletSelectorOpen(true)}
                  className="text-xs px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold transition-all flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Trocar Tipo de Prova (1, 2, 3 ou 4)</span>
                </button>
              </div>

              <QuestionCard
                question={currentQuestion}
                bookletNumber={currentIndex + 1}
                bookletType={bookletType}
                selectedOption={answers[currentQuestion.id]}
                onSelectOption={handleSelectOption}
                isMarkedForReview={reviewList.has(currentQuestion.id)}
                onToggleMarkForReview={handleToggleMarkForReview}
                mode={mode}
                isExamFinished={isFinished}
                scratchNotes={scratchNotes[currentQuestion.id]}
                onOpenScratchpad={(qId) => setActiveScratchQuestionId(qId)}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
              />

              {/* Bottom Quick Bar */}
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                <button
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Questão Anterior
                </button>

                <div className="text-xs text-slate-500 font-mono hidden sm:block">
                  Atalhos: Teclas <strong>A, B, C, D</strong> p/ marcar • Setas <strong>← / →</strong>
                </div>

                <button
                  onClick={() =>
                    setCurrentIndex((i) => Math.min(bookletQuestions.length - 1, i + 1))
                  }
                  disabled={currentIndex === bookletQuestions.length - 1}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Próxima Questão →
                </button>
              </div>
            </div>

            {/* Right Column: Navigator & Tools (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <QuestionNavigator
                currentIndex={currentIndex}
                onSelectIndex={(idx) => setCurrentIndex(idx)}
                questions={bookletQuestions}
                bookletType={bookletType}
                onChangeBookletType={(type) => setBookletType(type)}
                onOpenBookletSelector={() => setIsBookletSelectorOpen(true)}
                answers={answers}
                reviewList={reviewList}
                selectedDiscipline={selectedDiscipline}
                onSelectDiscipline={(disc) => setSelectedDiscipline(disc)}
                isExamFinished={isFinished}
              />

              {/* Quick Actions Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Ferramentas do Candidato
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsAnswerSheetOpen(true)}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                    <span>Cartão Óptico</span>
                  </button>

                  <button
                    onClick={() => setIsCalculatorOpen(true)}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Calculator className="w-4 h-4 text-amber-500" />
                    <span>Calculadora</span>
                  </button>

                  <button
                    onClick={() => setActiveScratchQuestionId(currentQuestion.id)}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>Rascunho Q.{currentIndex + 1}</span>
                  </button>

                  <button
                    onClick={() => setIsInstructionsOpen(true)}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-emerald-500" />
                    <span>Edital & Regras</span>
                  </button>
                </div>

                <button
                  onClick={handleFinishExamPrompt}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition-transform active:scale-95 flex items-center justify-center gap-1.5 mt-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Finalizar e Entregar Simulado</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal before finishing exam */}
      {showConfirmFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-slate-900 dark:text-slate-100">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold">Deseja entregar sua prova agora?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Você respondeu <strong>{answeredCount} de 50 questões</strong>.
                {50 - answeredCount > 0 && (
                  <span className="block text-rose-600 dark:text-rose-400 font-semibold mt-1">
                    Atenção: Há {50 - answeredCount} questão(ões) em branco no cartão!
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmFinishModal(false)}
                className="flex-1 py-2 px-4 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Voltar à Prova
              </button>
              <button
                onClick={handleConfirmFinish}
                className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition-transform active:scale-95"
              >
                Confirmar e Entregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booklet Type Selection Modal */}
      <BookletSelectorModal
        isOpen={isBookletSelectorOpen}
        onClose={() => setIsBookletSelectorOpen(false)}
        selectedBooklet={bookletType}
        onSelectBooklet={(type) => setBookletType(type)}
        isExamFinished={isFinished}
      />

      {/* Answer Sheet Optical Modal */}
      <AnswerSheetModal
        isOpen={isAnswerSheetOpen}
        onClose={() => setIsAnswerSheetOpen(false)}
        bookletType={bookletType}
        onChangeBookletType={(newType) => setBookletType(newType)}
        answers={answers}
        onSelectAnswer={(qId, option) =>
          setAnswers((prev) => ({ ...prev, [qId]: option }))
        }
        reviewList={reviewList}
        currentQuestionIndex={currentIndex}
        onNavigateToQuestion={(idx) => setCurrentIndex(idx)}
        onFinishExam={handleFinishExamPrompt}
        isExamFinished={isFinished}
      />

      {/* Built-in Exam Calculator Modal */}
      <CalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* Instructions Booklet Modal */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        bookletType={bookletType}
      />

      {/* Scratchpad Note Modal */}
      {activeScratchQuestionId !== null && (
        <ScratchpadModal
          isOpen={true}
          onClose={() => setActiveScratchQuestionId(null)}
          questionId={activeScratchQuestionId}
          note={scratchNotes[activeScratchQuestionId] || ''}
          onSaveNote={(qId, text) =>
            setScratchNotes((prev) => ({ ...prev, [qId]: text }))
          }
        />
      )}
    </div>
  );
}
