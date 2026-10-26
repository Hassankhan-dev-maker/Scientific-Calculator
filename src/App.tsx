/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  evaluateExpression,
  AngleMode,
  NumberFormat,
  MathResult,
} from './utils/mathEngine';
import { soundHaptics } from './utils/audioHaptics';
import { GraphingCalculator } from './components/GraphingCalculator';
import { EquationSolverModal } from './components/EquationSolverModal';
import { ProgrammerCalculator } from './components/ProgrammerCalculator';
import { StatisticsModal } from './components/StatisticsModal';
import { MatrixVectorModal } from './components/MatrixVectorModal';
import { CalculusModal } from './components/CalculusModal';
import { UnitConverterModal } from './components/UnitConverterModal';
import { ConstantsModal } from './components/ConstantsModal';
import { FormulasModal } from './components/FormulasModal';
import { PlayStoreModal } from './components/PlayStoreModal';
import {
  History,
  Settings,
  Delete,
  Sparkles,
  Download,
  Trash2,
  Star,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Vibrate,
  Sliders,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type AppMode =
  | 'calculator'
  | 'graphing'
  | 'equation'
  | 'programmer'
  | 'statistics'
  | 'matrix'
  | 'calculus'
  | 'converter'
  | 'constants'
  | 'formulas'
  | 'playstore';

export type ThemeName = 'dark' | 'amoled' | 'light' | 'cyber' | 'emerald';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
  pinned: boolean;
  type: string;
}

export default function App() {
  // App Navigation Mode
  const [activeMode, setActiveMode] = useState<AppMode>('calculator');

  // Calculator State
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<MathResult | null>(null);
  const [ans, setAns] = useState<string>('0');
  const [memory, setMemory] = useState<number>(0);
  const [isSecondFunction, setIsSecondFunction] = useState<boolean>(false);
  const [isHyperbolic, setIsHyperbolic] = useState<boolean>(false);

  // Settings & Theme
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [numberFormat, setNumberFormat] = useState<NumberFormat>('normal');
  const [precision, setPrecision] = useState<number>(8);
  const [thousandsSeparator, setThousandsSeparator] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<ThemeName>('dark');

  // Drawers & Modals
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [historySearch, setHistorySearch] = useState<string>('');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Persistent History
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('calc_pro_history_2026');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem('calc_pro_history_2026', JSON.stringify(history));
    } catch {
      // LocalStorage error fallback
    }
  }, [history]);

  // Sync sound & haptics with utility service
  useEffect(() => {
    soundHaptics.soundEnabled = soundEnabled;
    soundHaptics.hapticEnabled = hapticEnabled;
  }, [soundEnabled, hapticEnabled]);

  // Real-time evaluation preview as user types
  useEffect(() => {
    if (!expression.trim()) {
      setResult(null);
      return;
    }
    const res = evaluateExpression(expression, {
      angleMode,
      precision,
      numberFormat,
      thousandsSeparator,
      variables: { Ans: parseFloat(ans) || 0 },
    });
    setResult(res);
  }, [expression, angleMode, precision, numberFormat, thousandsSeparator, ans]);

  // Append token to expression
  const appendToken = (token: string, clickType: 'num' | 'op' | 'action' = 'num') => {
    soundHaptics.playKeyClick(clickType);
    setExpression(prev => prev + token);
  };

  // Backspace (Delete last character)
  const handleBackspace = () => {
    soundHaptics.playKeyClick('action');
    setExpression(prev => prev.slice(0, -1));
  };

  // Clear expression
  const handleClear = () => {
    soundHaptics.playKeyClick('action');
    setExpression('');
    setResult(null);
  };

  // Evaluate / Equals
  const handleEquals = () => {
    soundHaptics.playKeyClick('action');
    if (!expression.trim()) return;

    const res = evaluateExpression(expression, {
      angleMode,
      precision,
      numberFormat,
      thousandsSeparator,
      variables: { Ans: parseFloat(ans) || 0 },
    });

    if (res.success) {
      setAns(res.formatted);
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        expression,
        result: res.formatted,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pinned: false,
        type: res.type,
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 49)]);

      // Little celebratory burst on complex calculations
      if (expression.length > 10) {
        confetti({ particleCount: 20, spread: 40, origin: { y: 0.8 } });
      }
    }
  };

  // Memory Functions
  const handleMemoryAdd = () => {
    soundHaptics.playKeyClick('action');
    const val = result?.success ? Number(result.raw) : parseFloat(expression) || 0;
    setMemory(prev => prev + val);
  };

  const handleMemorySubtract = () => {
    soundHaptics.playKeyClick('action');
    const val = result?.success ? Number(result.raw) : parseFloat(expression) || 0;
    setMemory(prev => prev - val);
  };

  const handleMemoryRecall = () => {
    soundHaptics.playKeyClick('action');
    appendToken(memory.toString(), 'num');
  };

  const handleMemoryClear = () => {
    soundHaptics.playKeyClick('action');
    setMemory(0);
  };

  // Copy result to clipboard
  const handleCopyResult = (text: string) => {
    soundHaptics.playKeyClick('action');
    navigator.clipboard.writeText(text);
    setCopiedNotification('Result copied to clipboard');
    setTimeout(() => setCopiedNotification(null), 2000);
  };

  // Export History
  const exportHistory = (format: 'txt' | 'csv') => {
    soundHaptics.playKeyClick('action');
    let content = '';
    if (format === 'csv') {
      content = 'Timestamp,Expression,Result,Type\n' +
        history.map(h => `"${h.timestamp}","${h.expression}","${h.result}","${h.type}"`).join('\n');
    } else {
      content = '=== Scientific Calculator Pro 2026 History ===\n\n' +
        history.map(h => `[${h.timestamp}] ${h.expression} = ${h.result}`).join('\n');
    }
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculator_history_${Date.now()}.${format}`;
    a.click();
  };

  // Theme Classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'amoled':
        return 'bg-black text-white';
      case 'light':
        return 'bg-slate-100 text-slate-900';
      case 'cyber':
        return 'bg-slate-950 text-cyan-100';
      case 'emerald':
        return 'bg-stone-950 text-emerald-100';
      default:
        // Dark
        return 'bg-slate-950 text-slate-100';
    }
  };

  const getCardClasses = () => {
    switch (theme) {
      case 'amoled':
        return 'bg-zinc-950 border-zinc-800';
      case 'light':
        return 'bg-white border-slate-200 shadow-sm';
      case 'cyber':
        return 'bg-slate-900/90 border-cyan-800/40 shadow-cyan-950/40';
      case 'emerald':
        return 'bg-stone-900 border-emerald-900/40';
      default:
        return 'bg-slate-900 border-slate-800';
    }
  };

  // Filtered History
  const filteredHistory = history.filter(
    h =>
      h.expression.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.result.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-screen w-full select-none ${getThemeClasses()} overflow-hidden font-sans`}>
      {/* Top Android Header & Mode Navigation Bar */}
      <header className={`flex items-center justify-between px-3 py-2.5 border-b z-20 ${getCardClasses()}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-cyan-600/30 text-sm">
            fx
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight leading-none">
              Scientific Calculator <span className="text-cyan-400">Pro 2026</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
              <span className="font-mono text-emerald-400 font-semibold">{angleMode}</span>
              <span>•</span>
              <span className="capitalize">{numberFormat}</span>
              {memory !== 0 && (
                <>
                  <span>•</span>
                  <span className="px-1 bg-amber-500/20 text-amber-300 rounded font-mono font-bold">
                    M
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-1">
          {/* Quick Angle Mode Toggle */}
          <button
            onClick={() => {
              soundHaptics.playKeyClick('op');
              setAngleMode(prev => (prev === 'DEG' ? 'RAD' : prev === 'RAD' ? 'GRAD' : 'DEG'));
            }}
            className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
            title="Toggle Angle Mode (DEG/RAD/GRAD)"
          >
            {angleMode}
          </button>

          {/* History Drawer Toggle */}
          <button
            onClick={() => {
              soundHaptics.playKeyClick('op');
              setShowHistory(true);
            }}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Calculation History"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Settings Modal Toggle */}
          <button
            onClick={() => {
              soundHaptics.playKeyClick('op');
              setShowSettings(true);
            }}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Settings & Themes"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mode Navigation Tabs (Android Horizontal Scroll) */}
      <nav className={`flex items-center gap-1 px-2 py-1.5 border-b overflow-x-auto scrollbar-none z-10 ${getCardClasses()}`}>
        {[
          { id: 'calculator', label: 'Scientific' },
          { id: 'graphing', label: 'Graphing' },
          { id: 'equation', label: 'Equation Solver' },
          { id: 'calculus', label: 'Calculus' },
          { id: 'programmer', label: 'Programmer' },
          { id: 'statistics', label: 'Statistics' },
          { id: 'matrix', label: 'Matrix & Vectors' },
          { id: 'converter', label: 'Unit Converter' },
          { id: 'constants', label: 'Constants' },
          { id: 'formulas', label: 'Formulas' },
          { id: 'playstore', label: 'Play Store Docs' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              soundHaptics.playKeyClick('op');
              setActiveMode(tab.id as AppMode);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition ${
              activeMode === tab.id
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main View Area */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {/* Toast Notification */}
        {copiedNotification && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{copiedNotification}</span>
          </div>
        )}

        {/* 1. Scientific Calculator Mode */}
        {activeMode === 'calculator' && (
          <div className="flex-1 flex flex-col justify-between p-2 sm:p-4 max-w-4xl w-full mx-auto overflow-hidden">
            {/* Display Screen */}
            <div
              className={`p-4 rounded-2xl border flex flex-col justify-between shadow-xl mb-2 transition-all ${
                theme === 'amoled'
                  ? 'bg-zinc-950 border-zinc-800'
                  : theme === 'light'
                  ? 'bg-white border-slate-200'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              {/* Formula expression input area */}
              <div className="min-h-[48px] flex items-center justify-end text-right overflow-x-auto whitespace-nowrap scrollbar-none">
                <span className="font-mono text-xl sm:text-2xl text-slate-300 font-medium tracking-wide select-all">
                  {expression || <span className="text-slate-600">0</span>}
                </span>
                <span className="w-0.5 h-6 bg-cyan-400 animate-pulse ml-1" />
              </div>

              {/* Real-time result output */}
              <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-slate-800/60">
                {/* Secondary Representations (Fraction / Scientific / Eng) */}
                <div className="flex items-center gap-2 overflow-x-auto text-xs text-slate-400 font-mono">
                  {result?.fraction && (
                    <button
                      onClick={() => handleCopyResult(result.fraction!)}
                      className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 text-[11px] border border-slate-700"
                      title="Exact Fraction"
                    >
                      {result.fraction}
                    </button>
                  )}
                  {result?.scientific && (
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      {result.scientific}
                    </span>
                  )}
                </div>

                {/* Primary Large Result */}
                <div
                  onClick={() => result?.formatted && handleCopyResult(result.formatted)}
                  className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-white cursor-pointer hover:text-cyan-300 transition select-all truncate ml-2"
                  title="Click to copy result"
                >
                  {result?.success ? (
                    `= ${result.formatted}`
                  ) : result?.error ? (
                    <span className="text-rose-400 text-sm font-sans">{result.error}</span>
                  ) : (
                    '= 0'
                  )}
                </div>
              </div>
            </div>

            {/* Memory Toolbar & Modifiers */}
            <div className="flex items-center justify-between gap-1 mb-2 px-1">
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={handleMemoryClear}
                  className="px-2 py-1 rounded bg-slate-800/70 hover:bg-slate-700 text-slate-300 font-mono text-[11px] border border-slate-700"
                >
                  MC
                </button>
                <button
                  onClick={handleMemoryRecall}
                  className="px-2 py-1 rounded bg-slate-800/70 hover:bg-slate-700 text-slate-300 font-mono text-[11px] border border-slate-700"
                >
                  MR
                </button>
                <button
                  onClick={handleMemoryAdd}
                  className="px-2 py-1 rounded bg-slate-800/70 hover:bg-slate-700 text-slate-300 font-mono text-[11px] border border-slate-700"
                >
                  M+
                </button>
                <button
                  onClick={handleMemorySubtract}
                  className="px-2 py-1 rounded bg-slate-800/70 hover:bg-slate-700 text-slate-300 font-mono text-[11px] border border-slate-700"
                >
                  M-
                </button>
                <button
                  onClick={() => appendToken('Ans', 'num')}
                  className="px-2 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 font-mono font-bold text-[11px] border border-cyan-800/60"
                >
                  Ans ({ans})
                </button>
              </div>

              <div className="flex items-center gap-1 text-xs">
                {/* 2nd Function Toggle */}
                <button
                  onClick={() => {
                    soundHaptics.playKeyClick('op');
                    setIsSecondFunction(!isSecondFunction);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    isSecondFunction
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                  }`}
                >
                  2nd
                </button>

                {/* Hyperbolic Toggle */}
                <button
                  onClick={() => {
                    soundHaptics.playKeyClick('op');
                    setIsHyperbolic(!isHyperbolic);
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition ${
                    isHyperbolic
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                  }`}
                >
                  hyp
                </button>
              </div>
            </div>

            {/* Scientific Keypad Grid - 6x6 Matrix */}
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2 flex-1 max-h-[520px]">
              {/* Row 1 */}
              <button
                onClick={() =>
                  appendToken(
                    isSecondFunction
                      ? isHyperbolic ? 'asinh(' : 'asin('
                      : isHyperbolic ? 'sinh(' : 'sin(',
                    'op'
                  )
                }
                className="btn-sci p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-mono text-sm font-semibold border border-slate-700/80 active:scale-95 transition"
              >
                {isSecondFunction ? (isHyperbolic ? 'asinh' : 'sin⁻¹') : isHyperbolic ? 'sinh' : 'sin'}
              </button>

              <button
                onClick={() =>
                  appendToken(
                    isSecondFunction
                      ? isHyperbolic ? 'acosh(' : 'acos('
                      : isHyperbolic ? 'cosh(' : 'cos(',
                    'op'
                  )
                }
                className="btn-sci p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-mono text-sm font-semibold border border-slate-700/80 active:scale-95 transition"
              >
                {isSecondFunction ? (isHyperbolic ? 'acosh' : 'cos⁻¹') : isHyperbolic ? 'cosh' : 'cos'}
              </button>

              <button
                onClick={() =>
                  appendToken(
                    isSecondFunction
                      ? isHyperbolic ? 'atanh(' : 'atan('
                      : isHyperbolic ? 'tanh(' : 'tan(',
                    'op'
                  )
                }
                className="btn-sci p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-mono text-sm font-semibold border border-slate-700/80 active:scale-95 transition"
              >
                {isSecondFunction ? (isHyperbolic ? 'atanh' : 'tan⁻¹') : isHyperbolic ? 'tanh' : 'tan'}
              </button>

              <button
                onClick={() => appendToken(isSecondFunction ? '10^(' : 'log10(', 'op')}
                className="btn-sci p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-mono text-sm font-semibold border border-slate-700/80 active:scale-95 transition"
              >
                {isSecondFunction ? '10ˣ' : 'log'}
              </button>

              <button
                onClick={() => appendToken(isSecondFunction ? 'e^(' : 'ln(', 'op')}
                className="btn-sci p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-mono text-sm font-semibold border border-slate-700/80 active:scale-95 transition"
              >
                {isSecondFunction ? 'eˣ' : 'ln'}
              </button>

              <button
                onClick={handleClear}
                className="btn-action p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 text-rose-300 font-mono text-sm font-bold border border-rose-800/70 active:scale-95 transition"
              >
                AC
              </button>

              {/* Row 2 */}
              <button
                onClick={() => appendToken(isSecondFunction ? 'cbrt(' : 'sqrt(', 'op')}
                className="btn-sci p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-mono text-sm font-semibold border border-slate-700/80 active:scale-95 transition"
              >
                {isSecondFunction ? '∛' : '√'}
              </button>

              <button
                onClick={() => appendToken(isSecondFunction ? '^3' : '^2', 'op')}
                className="btn-sci p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-mono text-sm font-semibold border border-slate-700/80 active:scale-95 transition"
              >
                {isSecondFunction ? 'x³' : 'x²'}
              </button>

              <button
                onClick={() => appendToken('^', 'op')}
                className="btn-sci p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-mono text-sm font-semibold border border-slate-700/80 active:scale-95 transition"
              >
                xʸ
              </button>

              <button
                onClick={() => appendToken(isSecondFunction ? 'cot(' : '(', 'op')}
                className="btn-sci p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-mono text-sm font-semibold border border-slate-700/80 active:scale-95 transition"
              >
                {isSecondFunction ? 'cot' : '('}
              </button>

              <button
                onClick={() => appendToken(isSecondFunction ? 'sec(' : ')', 'op')}
                className="btn-sci p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-mono text-sm font-semibold border border-slate-700/80 active:scale-95 transition"
              >
                {isSecondFunction ? 'sec' : ')'}
              </button>

              <button
                onClick={handleBackspace}
                aria-label="Delete last character"
                className="btn-action p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-sm font-bold border border-slate-700 flex items-center justify-center active:scale-95 transition"
              >
                <Delete className="w-5 h-5" />
              </button>

              {/* Row 3 */}
              <button
                onClick={() => appendToken(isSecondFunction ? 'csc(' : '1/(', 'op')}
                className="btn-sci p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-mono text-sm font-semibold border border-slate-700/80 active:scale-95 transition"
              >
                {isSecondFunction ? 'csc' : '1/x'}
              </button>

              <button
                onClick={() => appendToken('7', 'num')}
                className="btn-num p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white font-mono text-xl font-bold border border-slate-700/60 active:scale-95 transition"
              >
                7
              </button>

              <button
                onClick={() => appendToken('8', 'num')}
                className="btn-num p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white font-mono text-xl font-bold border border-slate-700/60 active:scale-95 transition"
              >
                8
              </button>

              <button
                onClick={() => appendToken('9', 'num')}
                className="btn-num p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white font-mono text-xl font-bold border border-slate-700/60 active:scale-95 transition"
              >
                9
              </button>

              <button
                onClick={() => appendToken('%', 'op')}
                className="btn-op p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-400 font-mono text-lg font-bold border border-slate-700 active:scale-95 transition"
              >
                %
              </button>

              <button
                onClick={() => appendToken('÷', 'op')}
                className="btn-op p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-400 font-mono text-xl font-bold border border-slate-700 active:scale-95 transition"
              >
                ÷
              </button>

              {/* Row 4 */}
              <button
                onClick={() => appendToken(isSecondFunction ? 'nPr(' : '!', 'op')}
                className="btn-sci p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-mono text-sm font-semibold border border-slate-700/80 active:scale-95 transition"
              >
                {isSecondFunction ? 'nPr' : 'x!'}
              </button>

              <button
                onClick={() => appendToken('4', 'num')}
                className="btn-num p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white font-mono text-xl font-bold border border-slate-700/60 active:scale-95 transition"
              >
                4
              </button>

              <button
                onClick={() => appendToken('5', 'num')}
                className="btn-num p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white font-mono text-xl font-bold border border-slate-700/60 active:scale-95 transition"
              >
                5
              </button>

              <button
                onClick={() => appendToken('6', 'num')}
                className="btn-num p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white font-mono text-xl font-bold border border-slate-700/60 active:scale-95 transition"
              >
                6
              </button>

              <button
                onClick={() => appendToken('π', 'num')}
                className="btn-sci p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-mono text-lg font-semibold border border-slate-700 active:scale-95 transition"
              >
                π
              </button>

              <button
                onClick={() => appendToken('×', 'op')}
                className="btn-op p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-400 font-mono text-xl font-bold border border-slate-700 active:scale-95 transition"
              >
                ×
              </button>

              {/* Row 5 */}
              <button
                onClick={() => appendToken(isSecondFunction ? 'nCr(' : 'abs(', 'op')}
                className="btn-sci p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-mono text-sm font-semibold border border-slate-700/80 active:scale-95 transition"
              >
                {isSecondFunction ? 'nCr' : '|x|'}
              </button>

              <button
                onClick={() => appendToken('1', 'num')}
                className="btn-num p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white font-mono text-xl font-bold border border-slate-700/60 active:scale-95 transition"
              >
                1
              </button>

              <button
                onClick={() => appendToken('2', 'num')}
                className="btn-num p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white font-mono text-xl font-bold border border-slate-700/60 active:scale-95 transition"
              >
                2
              </button>

              <button
                onClick={() => appendToken('3', 'num')}
                className="btn-num p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white font-mono text-xl font-bold border border-slate-700/60 active:scale-95 transition"
              >
                3
              </button>

              <button
                onClick={() => appendToken('e', 'num')}
                className="btn-sci p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-mono text-lg font-semibold border border-slate-700 active:scale-95 transition"
              >
                e
              </button>

              <button
                onClick={() => appendToken('-', 'op')}
                className="btn-op p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-400 font-mono text-xl font-bold border border-slate-700 active:scale-95 transition"
              >
                −
              </button>

              {/* Row 6 */}
              <button
                onClick={() => appendToken(isSecondFunction ? 'i' : '(-', 'op')}
                className="btn-sci p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-mono text-sm font-semibold border border-slate-700/80 active:scale-95 transition"
              >
                {isSecondFunction ? 'i (im)' : '±'}
              </button>

              <button
                onClick={() => appendToken('0', 'num')}
                className="btn-num p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white font-mono text-xl font-bold border border-slate-700/60 active:scale-95 transition"
              >
                0
              </button>

              <button
                onClick={() => appendToken('.', 'num')}
                className="btn-num p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white font-mono text-xl font-bold border border-slate-700/60 active:scale-95 transition"
              >
                .
              </button>

              <button
                onClick={() => appendToken('i', 'num')}
                className="btn-sci p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-purple-300 font-mono text-lg font-bold border border-slate-700 active:scale-95 transition"
              >
                i
              </button>

              <button
                onClick={() => appendToken('+', 'op')}
                className="btn-op p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-400 font-mono text-xl font-bold border border-slate-700 active:scale-95 transition"
              >
                +
              </button>

              <button
                onClick={handleEquals}
                className="btn-equals p-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-2xl font-bold shadow-lg shadow-cyan-600/30 active:scale-95 transition"
              >
                =
              </button>
            </div>
          </div>
        )}

        {/* 2. Graphing Calculator Mode */}
        {activeMode === 'graphing' && (
          <div className="flex-1 p-2 sm:p-4 overflow-hidden">
            <GraphingCalculator
              onInsertToCalc={val => {
                setExpression(val);
                setActiveMode('calculator');
              }}
            />
          </div>
        )}

        {/* 3. Equation Solver Mode */}
        {activeMode === 'equation' && (
          <div className="flex-1 overflow-hidden">
            <EquationSolverModal
              onInsertToCalc={val => {
                setExpression(val);
                setActiveMode('calculator');
              }}
            />
          </div>
        )}

        {/* 4. Calculus Suite Mode */}
        {activeMode === 'calculus' && (
          <div className="flex-1 overflow-hidden">
            <CalculusModal
              onInsertToCalc={val => {
                setExpression(val);
                setActiveMode('calculator');
              }}
            />
          </div>
        )}

        {/* 5. Programmer Mode */}
        {activeMode === 'programmer' && (
          <div className="flex-1 overflow-hidden">
            <ProgrammerCalculator />
          </div>
        )}

        {/* 6. Statistics Mode */}
        {activeMode === 'statistics' && (
          <div className="flex-1 overflow-hidden">
            <StatisticsModal
              onInsertToCalc={val => {
                setExpression(val);
                setActiveMode('calculator');
              }}
            />
          </div>
        )}

        {/* 7. Matrix & Vector Mode */}
        {activeMode === 'matrix' && (
          <div className="flex-1 overflow-hidden">
            <MatrixVectorModal
              onInsertToCalc={val => {
                setExpression(val);
                setActiveMode('calculator');
              }}
            />
          </div>
        )}

        {/* 8. Unit Converter Mode */}
        {activeMode === 'converter' && (
          <div className="flex-1 overflow-hidden">
            <UnitConverterModal
              onInsertToCalc={val => {
                setExpression(val);
                setActiveMode('calculator');
              }}
            />
          </div>
        )}

        {/* 9. Scientific Constants Database */}
        {activeMode === 'constants' && (
          <div className="flex-1 overflow-hidden">
            <ConstantsModal
              onInsertConstant={val => {
                setExpression(prev => prev + val);
                setActiveMode('calculator');
              }}
            />
          </div>
        )}

        {/* 10. Mathematical Formulas Library */}
        {activeMode === 'formulas' && (
          <div className="flex-1 overflow-hidden">
            <FormulasModal
              onInsertFormula={val => {
                setExpression(val);
                setActiveMode('calculator');
              }}
            />
          </div>
        )}

        {/* 11. Play Store Preparation & Docs */}
        {activeMode === 'playstore' && (
          <div className="flex-1 overflow-hidden">
            <PlayStoreModal />
          </div>
        )}
      </main>

      {/* History Drawer Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Calculation History</h3>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                  {history.length}
                </span>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Search and Action Toolbar */}
            <div className="p-3 border-b border-slate-800/80 flex items-center gap-2">
              <input
                type="text"
                placeholder="Search history..."
                value={historySearch}
                onChange={e => setHistorySearch(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
              <button
                onClick={() => exportHistory('csv')}
                title="Export CSV"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <Download className="w-4 h-4" />
              </button>
              {history.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Clear all calculation history?')) {
                      setHistory([]);
                    }
                  }}
                  title="Clear All"
                  className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No calculations recorded yet.
                </div>
              ) : (
                filteredHistory.map(item => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between group"
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        setExpression(item.expression);
                        setShowHistory(false);
                      }}
                    >
                      <div className="text-xs text-slate-400 font-mono">{item.expression}</div>
                      <div className="font-mono text-base font-bold text-cyan-300 mt-0.5">
                        = {item.result}
                      </div>
                      <span className="text-[10px] text-slate-600 mt-1 block">
                        {item.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => handleCopyResult(item.result)}
                        title="Copy Result"
                        className="p-1.5 text-slate-400 hover:text-white rounded"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setHistory(prev => prev.filter(h => h.id !== item.id))
                        }
                        title="Delete"
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Settings &amp; Personalization</h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto text-xs">
              {/* Theme Selector */}
              <div>
                <label className="text-slate-400 font-semibold uppercase tracking-wider block mb-2">
                  Theme Aesthetic
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'dark', name: 'Scientific Dark' },
                      { id: 'amoled', name: 'AMOLED Black' },
                      { id: 'light', name: 'Light Studio' },
                      { id: 'cyber', name: 'Cyber Blue' },
                      { id: 'emerald', name: 'Emerald Tech' },
                    ] as const
                  ).map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        soundHaptics.playKeyClick('op');
                        setTheme(t.id);
                      }}
                      className={`p-2 rounded-xl text-center font-medium border transition ${
                        theme === t.id
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Angle Mode */}
              <div>
                <label className="text-slate-400 font-semibold uppercase tracking-wider block mb-2">
                  Angle Calculation Mode
                </label>
                <div className="grid grid-cols-3 gap-2 font-mono">
                  {(['DEG', 'RAD', 'GRAD'] as AngleMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => {
                        soundHaptics.playKeyClick('op');
                        setAngleMode(mode);
                      }}
                      className={`p-2 rounded-xl text-center border transition ${
                        angleMode === mode
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number Format */}
              <div>
                <label className="text-slate-400 font-semibold uppercase tracking-wider block mb-2">
                  Number Notation
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['normal', 'scientific', 'engineering'] as NumberFormat[]).map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => {
                        soundHaptics.playKeyClick('op');
                        setNumberFormat(fmt);
                      }}
                      className={`p-2 rounded-xl text-center capitalize border transition ${
                        numberFormat === fmt
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Decimal Precision Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 font-semibold uppercase">Decimal Precision:</span>
                  <span className="font-mono text-cyan-400 font-bold">{precision} decimals</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={14}
                  value={precision}
                  onChange={e => setPrecision(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Thousands Separator (e.g. 1,000,000)</span>
                  <input
                    type="checkbox"
                    checked={thousandsSeparator}
                    onChange={e => setThousandsSeparator(e.target.checked)}
                    className="accent-cyan-500 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                    <span>Key Click Sound (Web Audio)</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={e => setSoundEnabled(e.target.checked)}
                    className="accent-cyan-500 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Vibrate className="w-4 h-4 text-cyan-400" />
                    <span>Haptic Vibration Feedback</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={hapticEnabled}
                    onChange={e => setHapticEnabled(e.target.checked)}
                    className="accent-cyan-500 w-4 h-4"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
