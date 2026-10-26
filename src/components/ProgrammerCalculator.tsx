/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  WordSize,
  NumberBase,
  formatAllBases,
  bitwiseOp,
  clampToWordSize,
  getMask,
} from '../utils/programmerEngine';
import { soundHaptics } from '../utils/audioHaptics';
import { Delete, RotateCcw } from 'lucide-react';

export const ProgrammerCalculator: React.FC = () => {
  const [val, setVal] = useState<bigint>(42n);
  const [wordSize, setWordSize] = useState<WordSize>(32);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [activeBase, setActiveBase] = useState<NumberBase>('DEC');

  // Pending binary op
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [operandA, setOperandA] = useState<bigint | null>(null);
  const [resetOnNextDigit, setResetOnNextDigit] = useState<boolean>(false);

  const bases = formatAllBases(val, wordSize, isSigned);

  // Handle digit / char entry
  const handleDigit = (char: string) => {
    soundHaptics.playKeyClick('num');

    let currentStr = '';
    if (resetOnNextDigit) {
      currentStr = char;
      setResetOnNextDigit(false);
    } else {
      if (activeBase === 'HEX') currentStr = bases.hexRaw + char;
      else if (activeBase === 'DEC') currentStr = (val === 0n ? '' : bases.dec) + char;
      else if (activeBase === 'OCT') currentStr = bases.octRaw + char;
      else currentStr = bases.binRaw + char;
    }

    try {
      let parsed: bigint;
      if (activeBase === 'HEX') parsed = BigInt('0x' + currentStr);
      else if (activeBase === 'DEC') parsed = BigInt(currentStr);
      else if (activeBase === 'OCT') parsed = BigInt('0o' + currentStr);
      else parsed = BigInt('0b' + currentStr);

      setVal(clampToWordSize(parsed, wordSize));
    } catch {
      // Ignore overflow or parse issue
    }
  };

  const handleBackspace = () => {
    soundHaptics.playKeyClick('action');
    let str = '';
    if (activeBase === 'HEX') str = bases.hexRaw;
    else if (activeBase === 'DEC') str = bases.dec;
    else if (activeBase === 'OCT') str = bases.octRaw;
    else str = bases.binRaw;

    if (str.length <= 1) {
      setVal(0n);
      return;
    }
    const truncated = str.slice(0, -1);
    try {
      if (activeBase === 'HEX') setVal(clampToWordSize(BigInt('0x' + truncated), wordSize));
      else if (activeBase === 'DEC') setVal(clampToWordSize(BigInt(truncated), wordSize));
      else if (activeBase === 'OCT') setVal(clampToWordSize(BigInt('0o' + truncated), wordSize));
      else setVal(clampToWordSize(BigInt('0b' + truncated), wordSize));
    } catch {
      setVal(0n);
    }
  };

  const handleClear = () => {
    soundHaptics.playKeyClick('action');
    setVal(0n);
    setOperandA(null);
    setPendingOp(null);
  };

  const handleBitwise = (op: any) => {
    soundHaptics.playKeyClick('op');
    if (op === 'NOT') {
      const res = bitwiseOp('NOT', val, 0n, wordSize);
      setVal(res);
      return;
    }
    setOperandA(val);
    setPendingOp(op);
    setResetOnNextDigit(true);
  };

  const handleEquals = () => {
    soundHaptics.playKeyClick('action');
    if (!pendingOp || operandA === null) return;

    let res = 0n;
    if (['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR', 'LSH', 'RSH', 'ASR', 'ROL', 'ROR'].includes(pendingOp)) {
      res = bitwiseOp(pendingOp as any, operandA, val, wordSize);
    } else if (pendingOp === '+') {
      res = clampToWordSize(operandA + val, wordSize);
    } else if (pendingOp === '-') {
      res = clampToWordSize(operandA - val, wordSize);
    } else if (pendingOp === '*') {
      res = clampToWordSize(operandA * val, wordSize);
    } else if (pendingOp === '/') {
      if (val !== 0n) res = clampToWordSize(operandA / val, wordSize);
    } else if (pendingOp === '%') {
      if (val !== 0n) res = clampToWordSize(operandA % val, wordSize);
    }

    setVal(res);
    setOperandA(null);
    setPendingOp(null);
    setResetOnNextDigit(true);
  };

  const handleArithmetic = (op: string) => {
    soundHaptics.playKeyClick('op');
    setOperandA(val);
    setPendingOp(op);
    setResetOnNextDigit(true);
  };

  // Toggle single bit in the interactive bit matrix
  const toggleBit = (bitIndex: number) => {
    soundHaptics.playKeyClick('num');
    const bitMask = 1n << BigInt(bitIndex);
    const newVal = val ^ bitMask;
    setVal(clampToWordSize(newVal, wordSize));
  };

  const isKeyDisabled = (key: string): boolean => {
    if (['A', 'B', 'C', 'D', 'E', 'F'].includes(key)) {
      return activeBase !== 'HEX';
    }
    const num = parseInt(key, 10);
    if (!isNaN(num)) {
      if (activeBase === 'BIN') return num > 1;
      if (activeBase === 'OCT') return num > 7;
      return false; // DEC and HEX allow 0-9
    }
    return false;
  };

  // Generate bit array for interactive toggling
  const bitCount = wordSize;
  const bitArray: boolean[] = [];
  for (let i = bitCount - 1; i >= 0; i--) {
    const isSet = ((val >> BigInt(i)) & 1n) === 1n;
    bitArray.push(isSet);
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-3 sm:p-4 overflow-y-auto space-y-3">
      {/* Top Word Size & Sign Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 font-semibold mr-1">SIZE:</span>
          {([64, 32, 16, 8] as WordSize[]).map(sz => (
            <button
              key={sz}
              onClick={() => {
                soundHaptics.playKeyClick('op');
                setWordSize(sz);
                setVal(clampToWordSize(val, sz));
              }}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition ${
                wordSize === sz
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sz === 64 ? 'QWORD (64)' : sz === 32 ? 'DWORD (32)' : sz === 16 ? 'WORD (16)' : 'BYTE (8)'}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            soundHaptics.playKeyClick('op');
            setIsSigned(!isSigned);
          }}
          className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
            isSigned ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {isSigned ? 'Signed (2\'s comp)' : 'Unsigned'}
        </button>
      </div>

      {/* 4 Bases Readout Display */}
      <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
        {(['HEX', 'DEC', 'OCT', 'BIN'] as NumberBase[]).map(baseKey => (
          <button
            key={baseKey}
            onClick={() => {
              soundHaptics.playKeyClick('op');
              setActiveBase(baseKey);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition font-mono ${
              activeBase === baseKey
                ? 'bg-slate-800 border-l-4 border-l-cyan-500 shadow-inner'
                : 'hover:bg-slate-800/50'
            }`}
          >
            <span
              className={`text-xs font-bold w-12 ${
                activeBase === baseKey ? 'text-cyan-400' : 'text-slate-500'
              }`}
            >
              {baseKey}
            </span>
            <span
              className={`text-sm truncate select-all font-semibold ${
                activeBase === baseKey ? 'text-white font-bold' : 'text-slate-300'
              }`}
            >
              {baseKey === 'HEX'
                ? bases.hex
                : baseKey === 'DEC'
                ? bases.dec
                : baseKey === 'OCT'
                ? bases.oct
                : bases.bin}
            </span>
          </button>
        ))}
      </div>

      {/* Interactive Clickable Bit Matrix (0/1 toggle) */}
      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase mb-2">
          <span>Interactive Bit Matrix (Click to flip bit)</span>
          <span className="font-mono text-cyan-400">Bits {bitCount - 1} .. 0</span>
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 font-mono text-xs">
          {bitArray.map((isSet, idx) => {
            const bitNum = bitCount - 1 - idx;
            return (
              <button
                key={idx}
                onClick={() => toggleBit(bitNum)}
                className={`py-1.5 px-0.5 rounded flex flex-col items-center justify-center transition border ${
                  isSet
                    ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
                title={`Bit ${bitNum}: ${isSet ? '1' : '0'}`}
              >
                <span>{isSet ? '1' : '0'}</span>
                <span className="text-[9px] text-slate-600">{bitNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bitwise Function Toolbar */}
      <div className="flex flex-wrap gap-1.5 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
        {['AND', 'OR', 'XOR', 'NOT', 'NAND', 'NOR', 'XNOR', 'LSH', 'RSH', 'ASR', 'ROL', 'ROR'].map(
          op => (
            <button
              key={op}
              onClick={() => handleBitwise(op)}
              className="flex-1 min-w-[50px] py-1.5 text-xs font-mono font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
            >
              {op}
            </button>
          )
        )}
      </div>

      {/* Programmer Keypad */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {/* Row 1: A, B, 7, 8, 9 */}
        {['A', 'B', '7', '8', '9'].map(k => (
          <button
            key={k}
            disabled={isKeyDisabled(k)}
            onClick={() => handleDigit(k)}
            className={`py-3 rounded-xl font-mono text-base font-bold transition ${
              isKeyDisabled(k)
                ? 'bg-slate-950/40 text-slate-700 cursor-not-allowed border border-transparent'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-sm active:scale-95'
            }`}
          >
            {k}
          </button>
        ))}

        {/* Row 2: C, D, 4, 5, 6 */}
        {['C', 'D', '4', '5', '6'].map(k => (
          <button
            key={k}
            disabled={isKeyDisabled(k)}
            onClick={() => handleDigit(k)}
            className={`py-3 rounded-xl font-mono text-base font-bold transition ${
              isKeyDisabled(k)
                ? 'bg-slate-950/40 text-slate-700 cursor-not-allowed border border-transparent'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-sm active:scale-95'
            }`}
          >
            {k}
          </button>
        ))}

        {/* Row 3: E, F, 1, 2, 3 */}
        {['E', 'F', '1', '2', '3'].map(k => (
          <button
            key={k}
            disabled={isKeyDisabled(k)}
            onClick={() => handleDigit(k)}
            className={`py-3 rounded-xl font-mono text-base font-bold transition ${
              isKeyDisabled(k)
                ? 'bg-slate-950/40 text-slate-700 cursor-not-allowed border border-transparent'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-sm active:scale-95'
            }`}
          >
            {k}
          </button>
        ))}

        {/* Row 4: Clear, 0, Backspace, Ops */}
        <button
          onClick={handleClear}
          className="py-3 rounded-xl font-mono text-sm font-bold bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 active:scale-95 transition"
        >
          CLR
        </button>
        <button
          disabled={isKeyDisabled('0')}
          onClick={() => handleDigit('0')}
          className="py-3 rounded-xl font-mono text-base font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 active:scale-95 transition"
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          aria-label="Delete last digit"
          className="py-3 rounded-xl font-mono text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center active:scale-95 transition"
        >
          <Delete className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleArithmetic('+')}
          className="py-3 rounded-xl font-mono text-base font-bold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 active:scale-95 transition"
        >
          +
        </button>
        <button
          onClick={() => handleArithmetic('-')}
          className="py-3 rounded-xl font-mono text-base font-bold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 active:scale-95 transition"
        >
          -
        </button>

        {/* Row 5: Arithmetic & Equals */}
        <button
          onClick={() => handleArithmetic('*')}
          className="py-3 rounded-xl font-mono text-base font-bold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 active:scale-95 transition"
        >
          ×
        </button>
        <button
          onClick={() => handleArithmetic('/')}
          className="py-3 rounded-xl font-mono text-base font-bold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 active:scale-95 transition"
        >
          ÷
        </button>
        <button
          onClick={() => handleArithmetic('%')}
          className="py-3 rounded-xl font-mono text-base font-bold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 active:scale-95 transition"
        >
          MOD
        </button>
        <button
          onClick={handleEquals}
          className="col-span-2 py-3 rounded-xl font-mono text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/30 active:scale-95 transition"
        >
          =
        </button>
      </div>
    </div>
  );
};
