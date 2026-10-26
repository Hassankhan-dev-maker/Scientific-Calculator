/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SCIENTIFIC_CONSTANTS, ScientificConstant } from '../utils/constantsData';
import { soundHaptics } from '../utils/audioHaptics';
import { Search, Copy, Check, ArrowUpRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const ConstantsModal: React.FC<{
  onInsertConstant?: (value: string) => void;
}> = ({ onInsertConstant }) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Universal', 'Electromagnetic', 'Atomic & Nuclear', 'Physico-chemical', 'Astrophysical'];

  const filtered = SCIENTIFIC_CONSTANTS.filter(c => {
    const matchesCat = selectedCat === 'All' || c.category === selectedCat;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (constant: ScientificConstant) => {
    soundHaptics.playKeyClick('action');
    navigator.clipboard.writeText(constant.value.toString());
    setCopiedId(constant.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsert = (constant: ScientificConstant) => {
    soundHaptics.playKeyClick('action');
    if (onInsertConstant) {
      onInsertConstant(constant.value.toString());
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
          placeholder="Search 20+ constants (e.g. speed of light, Planck, G)..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
        />
      </div>

      {/* Category Filter Pills */}
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

      {/* Constants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(c => (
          <div
            key={c.id}
            className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{c.name}</span>
                    {c.isExact && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        Exact
                      </span>
                    )}
                  </h4>
                  <span className="text-xs text-slate-400">{c.category}</span>
                </div>
                <div className="font-mono text-base font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {c.symbol}
                </div>
              </div>

              {/* Value and Unit */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 my-2">
                <div className="font-mono text-sm font-semibold text-emerald-300 select-all">
                  {c.valueStr}
                </div>
                <div className="text-xs font-mono text-slate-400 mt-0.5">{c.unit}</div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>

              <div className="mt-2 text-[11px] text-slate-400 flex flex-col gap-0.5 border-t border-slate-800/60 pt-2">
                <span className="flex items-center gap-1 text-slate-400">
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  <span>Uncertainty: {c.uncertainty}</span>
                </span>
                <span className="text-slate-400">Ref: {c.source}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 mt-3 pt-2">
              <button
                onClick={() => handleCopy(c)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {copiedId === c.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedId === c.id ? 'Copied' : 'Copy'}</span>
              </button>

              {onInsertConstant && (
                <button
                  onClick={() => handleInsert(c)}
                  className="flex items-center gap-1 px-3 py-1 text-xs rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition"
                >
                  <span>Insert in Calc</span>
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
