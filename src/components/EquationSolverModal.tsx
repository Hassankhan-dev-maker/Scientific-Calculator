/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  solveLinearEquation,
  solveQuadraticEquation,
  solveSystem2x2,
  solveCubicEquation,
  EDUCATIONAL_EXAMPLES,
  EquationSolution,
} from '../utils/equationSolver';
import { soundHaptics } from '../utils/audioHaptics';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const EquationSolverModal: React.FC<{
  onInsertToCalc?: (val: string) => void;
}> = ({ onInsertToCalc }) => {
  const [solverType, setSolverType] = useState<'quadratic' | 'linear' | 'system2' | 'cubic'>('quadratic');

  // Coefficients
  // Linear ax + b = c
  const [linA, setLinA] = useState('2');
  const [linB, setLinB] = useState('-8');
  const [linC, setLinC] = useState('0');

  // Quadratic ax² + bx + c = 0
  const [quadA, setQuadA] = useState('1');
  const [quadB, setQuadB] = useState('-5');
  const [quadC, setQuadC] = useState('6');

  // System 2x2
  const [sysA1, setSysA1] = useState('2');
  const [sysB1, setSysB1] = useState('3');
  const [sysC1, setSysC1] = useState('12');
  const [sysA2, setSysA2] = useState('1');
  const [sysB2, setSysB2] = useState('-1');
  const [sysC2, setSysC2] = useState('1');

  // Cubic ax³ + bx² + cx + d = 0
  const [cubA, setCubA] = useState('1');
  const [cubB, setCubB] = useState('-6');
  const [cubC, setCubC] = useState('11');
  const [cubD, setCubD] = useState('-6');

  // Selected educational curriculum tab
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('All');

  // Computed solution
  const [solution, setSolution] = useState<EquationSolution | null>(() =>
    solveQuadraticEquation(1, -5, 6)
  );

  const handleSolve = () => {
    soundHaptics.playKeyClick('action');
    if (solverType === 'linear') {
      const a = parseFloat(linA) || 0;
      const b = parseFloat(linB) || 0;
      const c = parseFloat(linC) || 0;
      setSolution(solveLinearEquation(a, b, c));
    } else if (solverType === 'quadratic') {
      const a = parseFloat(quadA) || 0;
      const b = parseFloat(quadB) || 0;
      const c = parseFloat(quadC) || 0;
      setSolution(solveQuadraticEquation(a, b, c));
    } else if (solverType === 'system2') {
      const a1 = parseFloat(sysA1) || 0;
      const b1 = parseFloat(sysB1) || 0;
      const c1 = parseFloat(sysC1) || 0;
      const a2 = parseFloat(sysA2) || 0;
      const b2 = parseFloat(sysB2) || 0;
      const c2 = parseFloat(sysC2) || 0;
      setSolution(solveSystem2x2(a1, b1, c1, a2, b2, c2));
    } else if (solverType === 'cubic') {
      const a = parseFloat(cubA) || 0;
      const b = parseFloat(cubB) || 0;
      const c = parseFloat(cubC) || 0;
      const d = parseFloat(cubD) || 0;
      setSolution(solveCubicEquation(a, b, c, d));
    }
  };

  const loadExample = (ex: typeof EDUCATIONAL_EXAMPLES[0]) => {
    soundHaptics.playKeyClick('num');
    setSolverType(ex.type);
    if (ex.type === 'quadratic') {
      setQuadA(ex.params[0].toString());
      setQuadB(ex.params[1].toString());
      setQuadC(ex.params[2].toString());
      setSolution(solveQuadraticEquation(ex.params[0], ex.params[1], ex.params[2]));
    } else if (ex.type === 'system2') {
      setSysA1(ex.params[0].toString());
      setSysB1(ex.params[1].toString());
      setSysC1(ex.params[2].toString());
      setSysA2(ex.params[3].toString());
      setSysB2(ex.params[4].toString());
      setSysC2(ex.params[5].toString());
      setSolution(
        solveSystem2x2(
          ex.params[0],
          ex.params[1],
          ex.params[2],
          ex.params[3],
          ex.params[4],
          ex.params[5]
        )
      );
    } else if (ex.type === 'cubic') {
      setCubA(ex.params[0].toString());
      setCubB(ex.params[1].toString());
      setCubC(ex.params[2].toString());
      setCubD(ex.params[3].toString());
      setSolution(
        solveCubicEquation(ex.params[0], ex.params[1], ex.params[2], ex.params[3])
      );
    }
  };

  const filteredExamples =
    selectedCurriculum === 'All'
      ? EDUCATIONAL_EXAMPLES
      : EDUCATIONAL_EXAMPLES.filter(e => e.category === selectedCurriculum);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-4 overflow-y-auto space-y-4">
      {/* Solver Mode Picker */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setSolverType('quadratic');
            soundHaptics.playKeyClick('op');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            solverType === 'quadratic'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Quadratic (ax² + bx + c = 0)
        </button>
        <button
          onClick={() => {
            setSolverType('linear');
            soundHaptics.playKeyClick('op');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            solverType === 'linear'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Linear (ax + b = c)
        </button>
        <button
          onClick={() => {
            setSolverType('system2');
            soundHaptics.playKeyClick('op');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            solverType === 'system2'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          System 2×2 (Cramer&apos;s Rule)
        </button>
        <button
          onClick={() => {
            setSolverType('cubic');
            soundHaptics.playKeyClick('op');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            solverType === 'cubic'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Cubic (ax³ + bx² + cx + d = 0)
        </button>
      </div>

      {/* Input Coefficient Controls */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">
          Enter Coefficients
        </h3>

        {solverType === 'linear' && (
          <div className="flex flex-wrap items-center gap-3 font-mono text-sm">
            <div className="flex items-center gap-1.5">
              <label htmlFor="lin-a" className="text-slate-400">a:</label>
              <input
                id="lin-a"
                type="number"
                value={linA}
                onChange={e => setLinA(e.target.value)}
                className="w-20 px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
              <span className="text-cyan-400">x +</span>
            </div>
            <div className="flex items-center gap-1.5">
              <label htmlFor="lin-b" className="text-slate-400">b:</label>
              <input
                id="lin-b"
                type="number"
                value={linB}
                onChange={e => setLinB(e.target.value)}
                className="w-20 px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
              <span className="text-slate-400">=</span>
            </div>
            <div className="flex items-center gap-1.5">
              <label htmlFor="lin-c" className="text-slate-400">c:</label>
              <input
                id="lin-c"
                type="number"
                value={linC}
                onChange={e => setLinC(e.target.value)}
                className="w-20 px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>
        )}

        {solverType === 'quadratic' && (
          <div className="flex flex-wrap items-center gap-3 font-mono text-sm">
            <div className="flex items-center gap-1.5">
              <label htmlFor="quad-a" className="text-slate-400">a:</label>
              <input
                id="quad-a"
                type="number"
                value={quadA}
                onChange={e => setQuadA(e.target.value)}
                className="w-20 px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
              <span className="text-cyan-400">x² +</span>
            </div>
            <div className="flex items-center gap-1.5">
              <label htmlFor="quad-b" className="text-slate-400">b:</label>
              <input
                id="quad-b"
                type="number"
                value={quadB}
                onChange={e => setQuadB(e.target.value)}
                className="w-20 px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
              <span className="text-cyan-400">x +</span>
            </div>
            <div className="flex items-center gap-1.5">
              <label htmlFor="quad-c" className="text-slate-400">c:</label>
              <input
                id="quad-c"
                type="number"
                value={quadC}
                onChange={e => setQuadC(e.target.value)}
                className="w-20 px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
              <span className="text-slate-400">= 0</span>
            </div>
          </div>
        )}

        {solverType === 'system2' && (
          <div className="space-y-3 font-mono text-sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-500 font-sans w-8">[Eq 1]</span>
              <input
                type="number"
                value={sysA1}
                onChange={e => setSysA1(e.target.value)}
                className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
              <span className="text-cyan-400">x +</span>
              <input
                type="number"
                value={sysB1}
                onChange={e => setSysB1(e.target.value)}
                className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
              <span className="text-cyan-400">y =</span>
              <input
                type="number"
                value={sysC1}
                onChange={e => setSysC1(e.target.value)}
                className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-500 font-sans w-8">[Eq 2]</span>
              <input
                type="number"
                value={sysA2}
                onChange={e => setSysA2(e.target.value)}
                className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
              <span className="text-cyan-400">x +</span>
              <input
                type="number"
                value={sysB2}
                onChange={e => setSysB2(e.target.value)}
                className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
              <span className="text-cyan-400">y =</span>
              <input
                type="number"
                value={sysC2}
                onChange={e => setSysC2(e.target.value)}
                className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>
        )}

        {solverType === 'cubic' && (
          <div className="flex flex-wrap items-center gap-3 font-mono text-sm">
            <div className="flex items-center gap-1.5">
              <label htmlFor="cub-a" className="text-slate-400">a:</label>
              <input
                id="cub-a"
                type="number"
                value={cubA}
                onChange={e => setCubA(e.target.value)}
                className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
              <span className="text-cyan-400">x³ +</span>
            </div>
            <div className="flex items-center gap-1.5">
              <label htmlFor="cub-b" className="text-slate-400">b:</label>
              <input
                id="cub-b"
                type="number"
                value={cubB}
                onChange={e => setCubB(e.target.value)}
                className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
              <span className="text-cyan-400">x² +</span>
            </div>
            <div className="flex items-center gap-1.5">
              <label htmlFor="cub-c" className="text-slate-400">c:</label>
              <input
                id="cub-c"
                type="number"
                value={cubC}
                onChange={e => setCubC(e.target.value)}
                className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
              <span className="text-cyan-400">x +</span>
            </div>
            <div className="flex items-center gap-1.5">
              <label htmlFor="cub-d" className="text-slate-400">d:</label>
              <input
                id="cub-d"
                type="number"
                value={cubD}
                onChange={e => setCubD(e.target.value)}
                className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
              <span className="text-slate-400">= 0</span>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handleSolve}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-600/30 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Solve with Steps</span>
          </button>
        </div>
      </div>

      {/* Solutions & Step-by-Step Breakdown */}
      {solution && (
        <div className="space-y-4">
          {/* Solution Summary Card */}
          <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/40 rounded-xl shadow-md">
            <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider mb-1">
              Final Answer & Roots
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              {solution.roots.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700"
                >
                  <span className="font-mono text-cyan-300 font-bold">{r.label} =</span>
                  <span className="font-mono text-white text-base font-semibold">{r.value}</span>
                  {onInsertToCalc && r.numericApprox !== undefined && (
                    <button
                      onClick={() => onInsertToCalc(r.value)}
                      title="Use in Calculator"
                      className="text-xs text-slate-400 hover:text-cyan-300 ml-1 underline"
                    >
                      Use
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">{solution.summary}</p>
          </div>

          {/* Step by Step Breakdown */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Mathematical Step-by-Step Derivation</span>
            </div>

            <div className="space-y-3">
              {solution.steps.map((st, i) => (
                <div
                  key={i}
                  className="bg-slate-950 p-3 rounded-lg border-l-4 border-l-cyan-500 border border-slate-800/60 space-y-1"
                >
                  <div className="text-xs font-bold text-cyan-400">{st.title}</div>
                  {st.rule && (
                    <div className="text-xs text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded w-fit">
                      Formula: {st.rule}
                    </div>
                  )}
                  <p className="text-xs text-slate-300">{st.detail}</p>
                  {st.calculation && (
                    <pre className="text-xs font-mono text-slate-200 bg-slate-900/80 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                      {st.calculation}
                    </pre>
                  )}
                  {st.result && (
                    <div className="text-xs font-mono text-emerald-400 font-semibold pt-1">
                      ➔ {st.result}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Verification Section */}
          {solution.verification.length > 0 && (
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Solution Verification (Residual Check)</span>
              </div>
              <p className="text-xs text-slate-400">
                Substituting calculated roots back into the original equation:
              </p>
              <div className="space-y-1.5 font-mono text-xs">
                {solution.verification.map((v, i) => (
                  <div
                    key={i}
                    className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <span className="text-slate-300">{v.substituted}</span>
                    <span
                      className={`text-[11px] font-semibold ${
                        v.isVerified ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      Residual: {v.residual} {v.isVerified ? '✓ Verified' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pre-built Curriculum Problems Library */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Curriculum Examples (Click to Solve)
          </span>
          <div className="flex gap-1 text-[11px]">
            {['All', 'Class 9-10', 'Class 11-12', 'Pre-Engineering'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCurriculum(cat)}
                className={`px-2 py-0.5 rounded transition ${
                  selectedCurriculum === cat
                    ? 'bg-cyan-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filteredExamples.map(ex => (
            <button
              key={ex.id}
              onClick={() => loadExample(ex)}
              className="text-left p-3 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-cyan-400 font-semibold">{ex.title}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                    {ex.category}
                  </span>
                </div>
                <div className="font-mono text-xs text-white font-medium mb-1">
                  {ex.problem}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{ex.notes}</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-cyan-400 mt-2 font-medium group-hover:translate-x-1 transition-transform">
                <span>Load & Solve</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
