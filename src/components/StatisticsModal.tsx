/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  calculate1VarStats,
  calculateLinearRegression,
  Stats1Var,
  Stats2Var,
} from '../utils/mathEngine';
import * as math from 'mathjs';
import { soundHaptics } from '../utils/audioHaptics';
import { BarChart3, TrendingUp, Sparkles, Binary } from 'lucide-react';

export const StatisticsModal: React.FC<{
  onInsertToCalc?: (val: string) => void;
}> = ({ onInsertToCalc }) => {
  const [activeTab, setActiveTab] = useState<'1var' | '2var' | 'distributions'>('1var');

  // 1-Var State
  const [data1VarInput, setData1VarInput] = useState<string>('12, 15, 18, 22, 22, 25, 30, 35, 40');
  const [stats1Var, setStats1Var] = useState<Stats1Var | null>(() =>
    calculate1VarStats([12, 15, 18, 22, 22, 25, 30, 35, 40])
  );

  // 2-Var State
  const [xInput, setXInput] = useState<string>('1, 2, 3, 4, 5, 6, 7');
  const [yInput, setYInput] = useState<string>('1.5, 3.8, 6.2, 7.9, 10.1, 12.4, 14.2');
  const [stats2Var, setStats2Var] = useState<Stats2Var | null>(() =>
    calculateLinearRegression(
      [1, 2, 3, 4, 5, 6, 7],
      [1.5, 3.8, 6.2, 7.9, 10.1, 12.4, 14.2]
    )
  );

  // Distributions State
  // Binomial
  const [binomN, setBinomN] = useState('10');
  const [binomP, setBinomP] = useState('0.5');
  const [binomK, setBinomK] = useState('5');
  const [binomResult, setBinomResult] = useState<number | null>(null);

  // Normal CDF
  const [normMean, setNormMean] = useState('0');
  const [normStd, setNormStd] = useState('1');
  const [normX, setNormX] = useState('1.96');
  const [normResult, setNormResult] = useState<number | null>(null);

  const handleCompute1Var = () => {
    soundHaptics.playKeyClick('action');
    const nums = data1VarInput
      .split(/[\s,;]+/)
      .map(v => parseFloat(v.trim()))
      .filter(v => !isNaN(v));
    setStats1Var(calculate1VarStats(nums));
  };

  const handleCompute2Var = () => {
    soundHaptics.playKeyClick('action');
    const xVals = xInput
      .split(/[\s,;]+/)
      .map(v => parseFloat(v.trim()))
      .filter(v => !isNaN(v));
    const yVals = yInput
      .split(/[\s,;]+/)
      .map(v => parseFloat(v.trim()))
      .filter(v => !isNaN(v));
    setStats2Var(calculateLinearRegression(xVals, yVals));
  };

  const handleComputeBinomial = () => {
    soundHaptics.playKeyClick('action');
    const n = parseInt(binomN, 10);
    const p = parseFloat(binomP);
    const k = parseInt(binomK, 10);
    if (isNaN(n) || isNaN(p) || isNaN(k) || p < 0 || p > 1 || k < 0 || k > n) {
      setBinomResult(null);
      return;
    }
    const comb = math.combinations(n, k);
    const prob = comb * Math.pow(p, k) * Math.pow(1 - p, n - k);
    setBinomResult(Number(prob.toFixed(6)));
  };

  const handleComputeNormal = () => {
    soundHaptics.playKeyClick('action');
    const mu = parseFloat(normMean);
    const sigma = parseFloat(normStd);
    const x = parseFloat(normX);
    if (isNaN(mu) || isNaN(sigma) || isNaN(x) || sigma <= 0) {
      setNormResult(null);
      return;
    }
    // Error function approximation for standard normal CDF
    const z = (x - mu) / (sigma * Math.SQRT2);
    // erf approximation
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = z < 0 ? -1 : 1;
    const absZ = Math.abs(z);
    const t = 1.0 / (1.0 + p * absZ);
    const y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-absZ * absZ);
    const erf = sign * y;
    const cdf = 0.5 * (1.0 + erf);
    setNormResult(Number(cdf.toFixed(6)));
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-4 overflow-y-auto space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            soundHaptics.playKeyClick('op');
            setActiveTab('1var');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === '1var'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>1-Variable Statistics</span>
        </button>

        <button
          onClick={() => {
            soundHaptics.playKeyClick('op');
            setActiveTab('2var');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === '2var'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>2-Var Linear Regression</span>
        </button>

        <button
          onClick={() => {
            soundHaptics.playKeyClick('op');
            setActiveTab('distributions');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'distributions'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Binary className="w-4 h-4" />
          <span>Probability Distributions</span>
        </button>
      </div>

      {/* 1-Variable Tab */}
      {activeTab === '1var' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <label htmlFor="dataset-1var-input" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Enter Data Values (separated by commas or spaces)
            </label>
            <textarea
              id="dataset-1var-input"
              rows={2}
              value={data1VarInput}
              onChange={e => setData1VarInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g. 10, 20, 25, 30, 42, 50"
            />
            <button
              onClick={handleCompute1Var}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Calculate Statistics</span>
            </button>
          </div>

          {stats1Var && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Sample Count (n)', val: stats1Var.count },
                { label: 'Sum (Σx)', val: stats1Var.sum },
                { label: 'Mean (x̄)', val: stats1Var.mean, highlight: true },
                { label: 'Median (Q2)', val: stats1Var.median, highlight: true },
                { label: 'Sample Std Dev (s)', val: stats1Var.stdSample, highlight: true },
                { label: 'Sample Variance (s²)', val: stats1Var.varianceSample },
                { label: 'Population Std Dev (σ)', val: stats1Var.stdPop },
                { label: 'Population Variance (σ²)', val: stats1Var.variancePop },
                { label: 'Minimum (MinX)', val: stats1Var.min },
                { label: 'Maximum (MaxX)', val: stats1Var.max },
                { label: 'Range', val: stats1Var.range },
                { label: 'Modes', val: stats1Var.modes.length > 0 ? stats1Var.modes.join(', ') : 'None' },
                { label: 'First Quartile (Q1)', val: stats1Var.q1 },
                { label: 'Third Quartile (Q3)', val: stats1Var.q3 },
                { label: 'Interquartile Range (IQR)', val: stats1Var.iqr },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex flex-col justify-between ${
                    item.highlight
                      ? 'bg-slate-900 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <span className="text-[11px] text-slate-400 font-medium">{item.label}</span>
                  <span
                    className={`font-mono text-base font-bold mt-1 ${
                      item.highlight ? 'text-cyan-300' : 'text-white'
                    }`}
                  >
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2-Variable Tab */}
      {activeTab === '2var' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Enter Paired (X, Y) Coordinates
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label htmlFor="reg-x-input" className="text-cyan-400 block mb-1">X values (comma separated):</label>
                <input
                  id="reg-x-input"
                  type="text"
                  value={xInput}
                  onChange={e => setXInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label htmlFor="reg-y-input" className="text-cyan-400 block mb-1">Y values (comma separated):</label>
                <input
                  id="reg-y-input"
                  type="text"
                  value={yInput}
                  onChange={e => setYInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>
            <button
              onClick={handleCompute2Var}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Compute Linear Regression</span>
            </button>
          </div>

          {stats2Var && (
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-500/50 rounded-2xl shadow-md">
                <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider mb-1">
                  Regression Line Equation
                </div>
                <div className="font-mono text-2xl font-bold text-white select-all">
                  {stats2Var.equation}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Slope (m)</span>
                  <div className="font-mono text-lg font-bold text-cyan-300 mt-1">
                    {stats2Var.slope}
                  </div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Y-Intercept (c)</span>
                  <div className="font-mono text-lg font-bold text-cyan-300 mt-1">
                    {stats2Var.intercept}
                  </div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Correlation (r)</span>
                  <div className="font-mono text-lg font-bold text-emerald-400 mt-1">
                    {stats2Var.correlationR}
                  </div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">R-Squared (R²)</span>
                  <div className="font-mono text-lg font-bold text-emerald-400 mt-1">
                    {stats2Var.rSquared}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Distributions Tab */}
      {activeTab === 'distributions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Binomial Distribution */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Binomial Distribution P(X = k)
            </h4>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <div>
                <label htmlFor="dist-binom-n" className="text-slate-400 block mb-1">Trials (n):</label>
                <input
                  id="dist-binom-n"
                  type="number"
                  value={binomN}
                  onChange={e => setBinomN(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="dist-binom-p" className="text-slate-400 block mb-1">Prob (p):</label>
                <input
                  id="dist-binom-p"
                  type="number"
                  step="0.01"
                  value={binomP}
                  onChange={e => setBinomP(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="dist-binom-k" className="text-slate-400 block mb-1">Success (k):</label>
                <input
                  id="dist-binom-k"
                  type="number"
                  value={binomK}
                  onChange={e => setBinomK(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>
            <button
              onClick={handleComputeBinomial}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-white transition"
            >
              Calculate P(X = {binomK})
            </button>
            {binomResult !== null && (
              <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/40 text-center font-mono">
                <span className="text-xs text-slate-400">Probability: </span>
                <span className="text-lg font-bold text-cyan-300">{binomResult}</span>
              </div>
            )}
          </div>

          {/* Normal Distribution */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Normal Distribution CDF P(X ≤ x)
            </h4>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <div>
                <label htmlFor="dist-norm-mu" className="text-slate-400 block mb-1">Mean (μ):</label>
                <input
                  id="dist-norm-mu"
                  type="number"
                  value={normMean}
                  onChange={e => setNormMean(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="dist-norm-sigma" className="text-slate-400 block mb-1">Std (σ):</label>
                <input
                  id="dist-norm-sigma"
                  type="number"
                  step="0.1"
                  value={normStd}
                  onChange={e => setNormStd(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="dist-norm-x" className="text-slate-400 block mb-1">Value (x):</label>
                <input
                  id="dist-norm-x"
                  type="number"
                  value={normX}
                  onChange={e => setNormX(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>
            <button
              onClick={handleComputeNormal}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-white transition"
            >
              Calculate P(X ≤ {normX})
            </button>
            {normResult !== null && (
              <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/40 text-center font-mono">
                <span className="text-xs text-slate-400">Cumulative Prob: </span>
                <span className="text-lg font-bold text-emerald-300">{normResult}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
