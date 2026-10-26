/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UNIT_CATEGORIES, convertUnits } from '../utils/converterData';
import { soundHaptics } from '../utils/audioHaptics';
import { ArrowRightLeft, Copy, Check, ArrowUpRight } from 'lucide-react';

export const UnitConverterModal: React.FC<{
  onInsertToCalc?: (val: string) => void;
}> = ({ onInsertToCalc }) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('length');
  const activeCategory = UNIT_CATEGORIES.find(c => c.id === selectedCatId) || UNIT_CATEGORIES[0];

  const [fromUnitId, setFromUnitId] = useState<string>(activeCategory.units[0].id);
  const [toUnitId, setToUnitId] = useState<string>(activeCategory.units[1]?.id || activeCategory.units[0].id);
  const [inputValue, setInputValue] = useState<string>('1');
  const [copied, setCopied] = useState(false);

  const handleCategoryChange = (catId: string) => {
    soundHaptics.playKeyClick('op');
    setSelectedCatId(catId);
    const cat = UNIT_CATEGORIES.find(c => c.id === catId);
    if (cat && cat.units.length >= 2) {
      setFromUnitId(cat.units[0].id);
      setToUnitId(cat.units[1].id);
    }
  };

  const handleSwap = () => {
    soundHaptics.playKeyClick('action');
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  const valNum = parseFloat(inputValue) || 0;
  const conversion = convertUnits(valNum, selectedCatId, fromUnitId, toUnitId);
  const resultFormatted = conversion ? Number(conversion.result.toPrecision(8)).toString() : '0';

  const handleCopy = () => {
    soundHaptics.playKeyClick('action');
    navigator.clipboard.writeText(resultFormatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-4 overflow-y-auto space-y-4">
      {/* Category Horizontal Scroll Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {UNIT_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
              selectedCatId === cat.id
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Main Converter Card */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        {/* From Section */}
        <div className="space-y-1.5">
          <label htmlFor="convert-from-input" className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            From
          </label>
          <div className="flex gap-2">
            <input
              id="convert-from-input"
              type="number"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xl font-mono text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="0"
            />
            <select
              aria-label="From unit"
              value={fromUnitId}
              onChange={e => {
                soundHaptics.playKeyClick('op');
                setFromUnitId(e.target.value);
              }}
              className="w-48 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {activeCategory.units.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-1">
          <button
            onClick={handleSwap}
            title="Swap Units"
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 shadow-md transition transform hover:rotate-180"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* To Section */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
            To (Converted Result)
          </span>
          <div className="flex gap-2">
            <div className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xl font-mono text-cyan-400 font-bold flex items-center overflow-x-auto">
              {resultFormatted}
            </div>
            <select
              aria-label="To unit"
              value={toUnitId}
              onChange={e => {
                soundHaptics.playKeyClick('op');
                setToUnitId(e.target.value);
              }}
              className="w-48 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {activeCategory.units.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons & Formula Details */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
          <span className="font-mono">{conversion?.formula}</span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {onInsertToCalc && (
              <button
                onClick={() => onInsertToCalc(resultFormatted)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition"
              >
                <span>Use in Calc</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Common Quick Reference conversions in current category */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
        <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
          Quick Comparison Table (1 {activeCategory.units.find(u => u.id === fromUnitId)?.symbol})
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {activeCategory.units.slice(0, 6).map(u => {
            const conv = convertUnits(1, selectedCatId, fromUnitId, u.id);
            return (
              <div
                key={u.id}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex flex-col"
              >
                <span className="text-[11px] text-slate-400">{u.name}</span>
                <span className="font-mono text-xs text-cyan-300 font-semibold truncate">
                  {conv ? Number(conv.result.toPrecision(6)) : 0} {u.symbol}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
