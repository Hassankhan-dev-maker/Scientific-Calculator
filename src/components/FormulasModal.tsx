/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FORMULA_LIBRARY, FormulaItem } from '../utils/formulaData';
import { soundHaptics } from '../utils/audioHaptics';
import { Search, Copy, Check, ArrowUpRight, BookOpen } from 'lucide-react';

export const FormulasModal: React.FC<{
  onInsertFormula?: (expr: string) => void;
}> = ({ onInsertFormula }) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Algebra',
    'Trigonometry',
    'Differentiation',
    'Integration',
    'Coordinate Geometry',
    'Vectors & Matrices',
    'Probability & Statistics',
    'Mechanics',
    'Electricity & Magnetism',
    'Modern Physics',
  ];

  const filtered = FORMULA_LIBRARY.filter(f => {
    const matchesCat = selectedCat === 'All' || f.category === selectedCat;
    const matchesSearch =
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.expression.toLowerCase().includes(search.toLowerCase()) ||
      f.explanation.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (formula: FormulaItem) => {
    soundHaptics.playKeyClick('action');
    navigator.clipboard.writeText(formula.expression);
    setCopiedId(formula.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsert = (formula: FormulaItem) => {
    soundHaptics.playKeyClick('action');
    if (onInsertFormula) {
      onInsertFormula(formula.templateInput || formula.expression);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-4 overflow-y-auto space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search formulas (e.g. Quadratic, Euler, Chain rule, Ohm's law)..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              soundHaptics.playKeyClick('op');
              setSelectedCat(cat);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedCat === cat
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Formulas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(f => (
          <div
            key={f.id}
            className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{f.title}</span>
                </h4>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-medium">
                  {f.category}
                </span>
              </div>

              {/* Mathematical Expression Card */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 my-2">
                <div className="font-mono text-base font-bold text-cyan-300 text-center select-all">
                  {f.expression}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">{f.explanation}</p>

              {/* Variables breakdown */}
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Variables</div>
                {f.variables.map((v, i) => (
                  <div key={i} className="text-xs flex items-center justify-between font-mono">
                    <span className="text-cyan-400 font-semibold">{v.name}:</span>
                    <span className="text-slate-300 font-sans text-[11px] truncate ml-2">
                      {v.meaning} {v.unit ? `(${v.unit})` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-800/60">
              <button
                onClick={() => handleCopy(f)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {copiedId === f.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedId === f.id ? 'Copied' : 'Copy'}</span>
              </button>

              {onInsertFormula && (
                <button
                  onClick={() => handleInsert(f)}
                  className="flex items-center gap-1 px-3 py-1 text-xs rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition"
                >
                  <span>Insert Formula</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
