'use client';

import React from 'react';
import { X, Clock, ShieldAlert, CheckCircle2, FileText, Award } from 'lucide-react';
import { BookletType, BOOKLET_TYPES, EXAM_METADATA } from '@/lib/cfc-exam-data';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookletType?: BookletType;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
  bookletType = 'tipo4',
}) => {
  if (!isOpen) return null;
  const activeBooklet = BOOKLET_TYPES[bookletType] || BOOKLET_TYPES.tipo4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-xl text-white">
              CFC
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Instruções Oficiais do Exame de Suficiência
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {EXAM_METADATA.edition} • FGV Conhecimento • {activeBooklet.coverTitle}
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
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Rule of 25 / Approval rule */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                Regra Oficial de Aprovação no Exame CFC
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                Para obter aprovação e obter o Registro Profissional no Conselho Regional de Contabilidade (CRC), o candidato deve acertar no mínimo <strong>25 questões (50% do total da prova)</strong>. Não há nota de corte por matéria específica.
              </p>
            </div>
          </div>

          {/* Sua Prova & Tempo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Sua Prova</span>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>O caderno contém 50 (cinquenta) questões objetivas.</li>
                <li>Cada questão possui 4 opções de resposta (A, B, C e D) e somente uma correta.</li>
                <li>Preencha o cartão de respostas dentro do tempo de prova.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Tempo Oficial de Prova</span>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Você dispõe de <strong>4 (quatro) horas</strong> para a realização da prova.</li>
                <li><strong>1h30min</strong> após o início: é possível retirar-se da sala sem levar o caderno.</li>
                <li>A partir dos <strong>30 minutos finais</strong>: é possível retirar-se levando o caderno.</li>
              </ul>
            </div>
          </div>

          {/* Não Será Permitido */}
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300 text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Não Será Permitido</span>
            </div>
            <ul className="text-xs text-rose-700 dark:text-rose-300 space-y-1 list-disc pl-4 leading-relaxed">
              <li>Qualquer tipo de comunicação entre os candidatos durante a aplicação da prova;</li>
              <li>Anotar informações relativas às respostas em qualquer outro meio que não seja o caderno de questões;</li>
              <li>Levantar da cadeira sem autorização do fiscal de sala;</li>
              <li>Usar o sanitário ao término da prova, após deixar a sala.</li>
            </ul>
          </div>

          {/* Informações Gerais */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Informações Gerais da FGV</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Para o preenchimento do cartão de respostas, use caneta esferográfica de material transparente com tinta preta ou azul.</li>
              <li>Assine seu nome apenas no espaço reservado no cartão de respostas.</li>
              <li>Confira o tipo do caderno de questões (Tipo 4).</li>
              <li>Calculadoras simples (não programáveis e não gráficas) são permitidas no exame oficial.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            Entendido, ir para a Prova
          </button>
        </div>
      </div>
    </div>
  );
};
