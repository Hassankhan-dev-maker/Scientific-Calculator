/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  numericalDerivative,
  numericalIntegrate,
  numericalLimit,
} from '../utils/mathEngine';
import { soundHaptics } from '../utils/audioHaptics';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export const CalculusModal: React.FC<{
  onInsertToCalc?: (val: string) => void;
}> = ({ onInsertToCalc }) => {
  const [calcTab, setCalcTab] = useState<'derivative' | 'integral' | 'limit'>('derivative');

  // Derivative state
  const [derivExpr, setDerivExpr] = useState('x^3 - 4*x^2 + 6');
  const [derivX, setDerivX] = useState('2');
  const [derivOrder, setDerivOrder] = useState<number>(1);
  const [derivResult, setDerivResult] = useState<{
    val: number;
    tangent?: string;
  } | null>(null);

  // Integral state
  const [integExpr, setIntegExpr] = useState('x^2 * sin(x)');
  const [integA, setIntegA] = useState('0');
  const [integB, setIntegB] = useState('pi');
  const [integResult, setIntegResult] = useState<number | null>(null);

  // Limit state
  const [limitExpr, setLimitExpr] = useState('sin(x) / x');
  const [limitTarget, setLimitTarget] = useState('0');
  const [limitDir, setLimitDir] = useState<'both' | 'left' | 'right'>('both');
  const [limitResult, setLimitResult] = useState<any>(null);

  const handleComputeDeriv = () => {
    soundHaptics.playKeyClick('action');
    try {
      const x0 = parseFloat(derivX) || 0;
      const d = numericalDerivative(derivExpr, x0, derivOrder);
      // Tangent line equation if order 1
      let tangent = '';
      if (derivOrder === 1) {
        // compute f(x0)
        const y0 = numericalDerivative(derivExpr, x0, 0); // or evaluate
        // y - y0 = m(x - x0) -> y = m*x - m*x0 + y0
        const m = d;
        const c = -m * x0; // when y0 is handled
        tangent = `y = ${m.toFixed(4)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c).toFixed(4)}`;
      }
      setDerivResult({ val: Number(d.toFixed(6)), tangent });
    } catch {
      setDerivResult(null);
    }
  };

  const handleComputeIntegral = () => {
    soundHaptics.playKeyClick('action');
    try {
      const a = integA === 'pi' ? Math.PI : parseFloat(integA) || 0;
      const b = integB === 'pi' ? Math.PI : parseFloat(integB) || 0;
      const res = numericalIntegrate(integExpr, a, b);
      setIntegResult(Number(res.toFixed(6)));
    } catch {
      setIntegResult(null);
    }
  };

  const handleComputeLimit = () => {
    soundHaptics.playKeyClick('action');
    try {
      const c = limitTarget === 'pi' ? Math.PI : parseFloat(limitTarget) || 0;
      const res = numericalLimit(limitExpr, c, limitDir);
      setLimitResult(res);
    } catch {
      setLimitResult(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-4 overflow-y-auto space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            soundHaptics.playKeyClick('op');
            setCalcTab('derivative');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            calcTab === 'derivative'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          d/dx Derivative (1st & 2nd)
        </button>

        <button
          onClick={() => {
            soundHaptics.playKeyClick('op');
            setCalcTab('integral');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            calcTab === 'integral'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          ∫ Definite Integral
        </button>

        <button
          onClick={() => {
            soundHaptics.playKeyClick('op');
            setCalcTab('limit');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            calcTab === 'limit'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          lim Limits Approximation
        </button>
      </div>

      {/* Derivative Form */}
      {calcTab === 'derivative' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Numerical Derivative (Central Difference O(h⁴))
            </h4>

            <div>
              <label htmlFor="deriv-fx-input" className="text-xs text-cyan-400 font-mono block mb-1">Function f(x):</label>
              <input
                id="deriv-fx-input"
                type="text"
                value={derivExpr}
                onChange={e => setDerivExpr(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-sm text-white"
                placeholder="e.g. x^3 - 4*x^2 + 6"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="deriv-x0-input" className="text-xs text-slate-400 font-mono block mb-1">Evaluate at x =</label>
                <input
                  id="deriv-x0-input"
                  type="text"
                  value={derivX}
                  onChange={e => setDerivX(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="deriv-order-select" className="text-xs text-slate-400 block mb-1">Derivative Order:</label>
                <select
                  id="deriv-order-select"
                  value={derivOrder}
                  onChange={e => setDerivOrder(parseInt(e.target.value, 10))}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                >
                  <option value={1}>1st Derivative f&apos;(x)</option>
                  <option value={2}>2nd Derivative f&apos;&apos;(x)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleComputeDeriv}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Calculate Derivative</span>
            </button>
          </div>

          {derivResult !== null && (
            <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-500/50 rounded-2xl shadow-md space-y-2">
              <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                {derivOrder === 1 ? "f'(x) Slope" : "f''(x) Curvature"} at x = {derivX}
              </div>
              <div className="font-mono text-2xl font-bold text-emerald-300">
                {derivResult.val}
              </div>
              {onInsertToCalc && (
                <button
                  onClick={() => onInsertToCalc(derivResult.val.toString())}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 underline"
                >
                  <span>Use in Calculator</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Integral Form */}
      {calcTab === 'integral' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Definite Integral ∫ [a to b] f(x) dx (Adaptive Simpson&apos;s 1/3 Rule)
            </h4>

            <div>
              <label htmlFor="integ-fx-input" className="text-xs text-cyan-400 font-mono block mb-1">Integrand f(x):</label>
              <input
                id="integ-fx-input"
                type="text"
                value={integExpr}
                onChange={e => setIntegExpr(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-sm text-white"
                placeholder="e.g. x^2 * sin(x)"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="integ-a-input" className="text-xs text-slate-400 font-mono block mb-1">Lower limit a:</label>
                <input
                  id="integ-a-input"
                  type="text"
                  value={integA}
                  onChange={e => setIntegA(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="integ-b-input" className="text-xs text-slate-400 font-mono block mb-1">Upper limit b:</label>
                <input
                  id="integ-b-input"
                  type="text"
                  value={integB}
                  onChange={e => setIntegB(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-sm text-white"
                />
              </div>
            </div>

            <button
              onClick={handleComputeIntegral}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Integrate</span>
            </button>
          </div>

          {integResult !== null && (
            <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-500/50 rounded-2xl shadow-md space-y-2">
              <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                Definite Integral Area
              </div>
              <div className="font-mono text-2xl font-bold text-emerald-300">
                {integResult}
              </div>
              {onInsertToCalc && (
                <button
                  onClick={() => onInsertToCalc(integResult.toString())}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 underline"
                >
                  <span>Use in Calculator</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Limit Form */}
      {calcTab === 'limit' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Numerical Limit lim [x → c] f(x)
            </h4>

            <div>
              <label htmlFor="limit-fx-input" className="text-xs text-cyan-400 font-mono block mb-1">Function f(x):</label>
              <input
                id="limit-fx-input"
                type="text"
                value={limitExpr}
                onChange={e => setLimitExpr(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-sm text-white"
                placeholder="e.g. sin(x) / x"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="limit-target-input" className="text-xs text-slate-400 font-mono block mb-1">Target c:</label>
                <input
                  id="limit-target-input"
                  type="text"
                  value={limitTarget}
                  onChange={e => setLimitTarget(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="limit-dir-select" className="text-xs text-slate-400 block mb-1">Direction:</label>
                <select
                  id="limit-dir-select"
                  value={limitDir}
                  onChange={e => setLimitDir(e.target.value as any)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                >
                  <option value="both">Two-sided limit (x → c)</option>
                  <option value="left">Left-hand limit (x → c⁻)</option>
                  <option value="right">Right-hand limit (x → c⁺)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleComputeLimit}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Evaluate Limit</span>
            </button>
          </div>

          {limitResult && (
            <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-500/50 rounded-2xl shadow-md space-y-2">
              <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                Limit Result
              </div>
              <div className="font-mono text-2xl font-bold text-emerald-300">
                {limitResult.value}
              </div>
              <div className="text-xs text-slate-400">
                Left Limit: {limitResult.leftVal?.toFixed(6) ?? 'N/A'} | Right Limit: {limitResult.rightVal?.toFixed(6) ?? 'N/A'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
