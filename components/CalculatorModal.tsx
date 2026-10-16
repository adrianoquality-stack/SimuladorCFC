'use client';

import React, { useState } from 'react';
import { X, Delete, RotateCcw } from 'lucide-react';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    setDisplay((prev) => {
      if (prev === '0' || prev === 'Erro') return digit;
      return prev + digit;
    });
  };

  const handleDecimal = () => {
    setDisplay((prev) => {
      if (prev.includes('.')) return prev;
      return prev + '.';
    });
  };

  const handleOperator = (op: string) => {
    setEquation(`${display} ${op} `);
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    setDisplay((prev) => {
      if (prev.length <= 1 || prev === 'Erro') return '0';
      return prev.slice(0, -1);
    });
  };

  const handlePercentage = () => {
    try {
      const val = parseFloat(display);
      const res = val / 100;
      setDisplay(res.toString());
    } catch {
      setDisplay('Erro');
    }
  };

  const handleSquareRoot = () => {
    try {
      const val = parseFloat(display);
      if (val < 0) {
        setDisplay('Erro');
        return;
      }
      const res = Math.sqrt(val);
      setDisplay(parseFloat(res.toFixed(6)).toString());
    } catch {
      setDisplay('Erro');
    }
  };

  const handleCalculate = () => {
    try {
      const fullExpr = equation + display;
      // Sanitize input: allow only digits, operators, dots, spaces
      if (!/^[0-9+\-*/. ]+$/.test(fullExpr)) {
        setDisplay('Erro');
        return;
      }
      // Safe evaluation using Function
      const result = new Function(`return (${fullExpr})`)();
      const rounded = Number.isFinite(result) ? parseFloat(result.toFixed(6)).toString() : 'Erro';
      setHistory((prev) => [`${fullExpr} = ${rounded}`, ...prev.slice(0, 5)]);
      setDisplay(rounded);
      setEquation('');
    } catch {
      setDisplay('Erro');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-white">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h3 className="font-bold text-sm text-slate-200">Calculadora Padrão do Candidato</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Screen */}
        <div className="p-4 bg-slate-950 text-right space-y-1 border-b border-slate-800">
          <div className="text-xs font-mono text-slate-500 min-h-[18px]">
            {equation || (history.length > 0 ? history[0] : '')}
          </div>
          <div className="text-3xl font-mono font-bold tracking-tight text-emerald-400 overflow-x-auto whitespace-nowrap">
            {display}
          </div>
          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
            <span>Memória: {memory}</span>
            <span>Permitida no Exame CFC</span>
          </div>
        </div>

        {/* Keypad */}
        <div className="p-3 grid grid-cols-4 gap-2 text-sm font-semibold select-none">
          {/* Row 1 */}
          <button
            onClick={() => setMemory(0)}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs transition-colors"
          >
            MC
          </button>
          <button
            onClick={() => setDisplay(memory.toString())}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs transition-colors"
          >
            MR
          </button>
          <button
            onClick={() => setMemory((m) => m + parseFloat(display || '0'))}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs transition-colors"
          >
            M+
          </button>
          <button
            onClick={() => setMemory((m) => m - parseFloat(display || '0'))}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs transition-colors"
          >
            M-
          </button>

          {/* Row 2 */}
          <button
            onClick={handleClear}
            className="p-2.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 transition-colors"
          >
            C
          </button>
          <button
            onClick={handleBackspace}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <Delete className="w-4 h-4" />
          </button>
          <button
            onClick={handlePercentage}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors"
          >
            %
          </button>
          <button
            onClick={() => handleOperator('/')}
            className="p-2.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 transition-colors text-base"
          >
            ÷
          </button>

          {/* Row 3 */}
          <button
            onClick={() => handleDigit('7')}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            7
          </button>
          <button
            onClick={() => handleDigit('8')}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            8
          </button>
          <button
            onClick={() => handleDigit('9')}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            9
          </button>
          <button
            onClick={() => handleOperator('*')}
            className="p-2.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 transition-colors text-base"
          >
            ×
          </button>

          {/* Row 4 */}
          <button
            onClick={() => handleDigit('4')}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            4
          </button>
          <button
            onClick={() => handleDigit('5')}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            5
          </button>
          <button
            onClick={() => handleDigit('6')}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            6
          </button>
          <button
            onClick={() => handleOperator('-')}
            className="p-2.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 transition-colors text-base"
          >
            −
          </button>

          {/* Row 5 */}
          <button
            onClick={() => handleDigit('1')}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            1
          </button>
          <button
            onClick={() => handleDigit('2')}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            2
          </button>
          <button
            onClick={() => handleDigit('3')}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            3
          </button>
          <button
            onClick={() => handleOperator('+')}
            className="p-2.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 transition-colors text-base"
          >
            +
          </button>

          {/* Row 6 */}
          <button
            onClick={handleSquareRoot}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs transition-colors"
          >
            √x
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            0
          </button>
          <button
            onClick={handleDecimal}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            ,
          </button>
          <button
            onClick={handleCalculate}
            className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow text-base"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};
