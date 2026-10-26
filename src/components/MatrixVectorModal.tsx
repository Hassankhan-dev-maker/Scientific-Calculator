/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as math from 'mathjs';
import { soundHaptics } from '../utils/audioHaptics';
import { Grid3X3, MoveRight, Sparkles } from 'lucide-react';

export const MatrixVectorModal: React.FC<{
  onInsertToCalc?: (val: string) => void;
}> = ({ onInsertToCalc }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'vector'>('matrix');

  // Matrix A (2x2 default)
  const [matrixA, setMatrixA] = useState<number[][]>([
    [1, 2],
    [3, 4],
  ]);
  // Matrix B (2x2 default)
  const [matrixB, setMatrixB] = useState<number[][]>([
    [5, 6],
    [7, 8],
  ]);
  const [matrixDim, setMatrixDim] = useState<number>(2); // 2 or 3
  const [matrixResult, setMatrixResult] = useState<any>(null);
  const [matrixOpTitle, setMatrixOpTitle] = useState<string>('Determinant det(A)');

  // Vector state (3D default)
  const [vecU, setVecU] = useState<[number, number, number]>([1, 2, 3]);
  const [vecV, setVecV] = useState<[number, number, number]>([4, 5, 6]);
  const [vectorResult, setVectorResult] = useState<any>(null);

  // Resize matrices
  const handleDimChange = (dim: number) => {
    soundHaptics.playKeyClick('op');
    setMatrixDim(dim);
    if (dim === 2) {
      setMatrixA([[1, 2], [3, 4]]);
      setMatrixB([[5, 6], [7, 8]]);
    } else {
      setMatrixA([[1, 2, 3], [0, 1, 4], [5, 6, 0]]);
      setMatrixB([[2, 0, -1], [1, 3, 2], [0, -2, 1]]);
    }
    setMatrixResult(null);
  };

  const updateCellA = (r: number, c: number, val: string) => {
    const num = parseFloat(val) || 0;
    const copy = matrixA.map(row => [...row]);
    copy[r][c] = num;
    setMatrixA(copy);
  };

  const updateCellB = (r: number, c: number, val: string) => {
    const num = parseFloat(val) || 0;
    const copy = matrixB.map(row => [...row]);
    copy[r][c] = num;
    setMatrixB(copy);
  };

  // Matrix Operations
  const handleMatrixOp = (op: 'add' | 'sub' | 'mul' | 'detA' | 'invA' | 'transA' | 'rankA') => {
    soundHaptics.playKeyClick('action');
    try {
      if (op === 'add') {
        const res = math.add(matrixA, matrixB);
        setMatrixOpTitle('Matrix A + Matrix B');
        setMatrixResult(res);
      } else if (op === 'sub') {
        const res = math.subtract(matrixA, matrixB);
        setMatrixOpTitle('Matrix A - Matrix B');
        setMatrixResult(res);
      } else if (op === 'mul') {
        const res = math.multiply(matrixA, matrixB);
        setMatrixOpTitle('Matrix A × Matrix B');
        setMatrixResult(res);
      } else if (op === 'detA') {
        const res = math.det(matrixA);
        setMatrixOpTitle('Determinant det(A)');
        setMatrixResult(Number(res.toFixed(6)));
      } else if (op === 'invA') {
        const d = math.det(matrixA);
        if (Math.abs(d) < 1e-12) {
          setMatrixOpTitle('Inverse A⁻¹');
          setMatrixResult('Singular Matrix (det = 0): No inverse exists');
          return;
        }
        const res = math.inv(matrixA);
        setMatrixOpTitle('Inverse Matrix A⁻¹');
        setMatrixResult(res);
      } else if (op === 'transA') {
        const res = math.transpose(matrixA);
        setMatrixOpTitle('Transpose Aᵀ');
        setMatrixResult(res);
      } else if (op === 'rankA') {
        // Compute matrix rank
        const d = math.det(matrixA);
        const rank = Math.abs(d) > 1e-9 ? matrixDim : matrixDim - 1;
        setMatrixOpTitle('Rank of Matrix A');
        setMatrixResult(`Rank(A) = ${rank}`);
      }
    } catch (err: any) {
      setMatrixResult('Error: ' + err?.message);
    }
  };

  // Vector Operations
  const handleVectorCompute = () => {
    soundHaptics.playKeyClick('action');
    const u = vecU;
    const v = vecV;

    // Dot product
    const dot = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];

    // Cross product
    const cross: [number, number, number] = [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    ];

    // Magnitudes
    const magU = Math.hypot(u[0], u[1], u[2]);
    const magV = Math.hypot(v[0], v[1], v[2]);

    // Angle
    const cosTheta = magU > 0 && magV > 0 ? Math.max(-1, Math.min(1, dot / (magU * magV))) : 0;
    const angleRad = Math.acos(cosTheta);
    const angleDeg = (angleRad * 180) / Math.PI;

    // Vector Addition & Subtraction
    const sum: [number, number, number] = [u[0] + v[0], u[1] + v[1], u[2] + v[2]];
    const diff: [number, number, number] = [u[0] - v[0], u[1] - v[1], u[2] - v[2]];

    setVectorResult({
      dot: Number(dot.toFixed(4)),
      cross,
      magU: Number(magU.toFixed(4)),
      magV: Number(magV.toFixed(4)),
      angleDeg: Number(angleDeg.toFixed(2)),
      angleRad: Number(angleRad.toFixed(4)),
      sum,
      diff,
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-4 overflow-y-auto space-y-4">
      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            soundHaptics.playKeyClick('op');
            setActiveTab('matrix');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'matrix'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
          <span>Matrix Operations</span>
        </button>

        <button
          onClick={() => {
            soundHaptics.playKeyClick('op');
            setActiveTab('vector');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'vector'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <MoveRight className="w-4 h-4" />
          <span>3D Vector Analysis</span>
        </button>
      </div>

      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Dimension Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Dimensions:</span>
            {[2, 3].map(dim => (
              <button
                key={dim}
                onClick={() => handleDimChange(dim)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                  matrixDim === dim
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {dim} × {dim}
              </button>
            ))}
          </div>

          {/* Matrix Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matrix A */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Matrix A ({matrixDim}×{matrixDim})
              </h4>
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${matrixDim}, minmax(0, 1fr))` }}
              >
                {matrixA.map((row, r) =>
                  row.map((val, c) => (
                    <input
                      key={`a-${r}-${c}`}
                      aria-label={`Matrix A row ${r + 1} column ${c + 1}`}
                      type="number"
                      value={val}
                      onChange={e => updateCellA(r, c, e.target.value)}
                      className="w-full text-center p-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  ))
                )}
              </div>
            </div>

            {/* Matrix B */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Matrix B ({matrixDim}×{matrixDim})
              </h4>
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${matrixDim}, minmax(0, 1fr))` }}
              >
                {matrixB.map((row, r) =>
                  row.map((val, c) => (
                    <input
                      key={`b-${r}-${c}`}
                      aria-label={`Matrix B row ${r + 1} column ${c + 1}`}
                      type="number"
                      value={val}
                      onChange={e => updateCellB(r, c, e.target.value)}
                      className="w-full text-center p-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Action Operation Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleMatrixOp('add')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              A + B
            </button>
            <button
              onClick={() => handleMatrixOp('sub')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              A − B
            </button>
            <button
              onClick={() => handleMatrixOp('mul')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              A × B
            </button>
            <button
              onClick={() => handleMatrixOp('detA')}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-700 text-xs font-semibold text-cyan-300 transition"
            >
              det(A)
            </button>
            <button
              onClick={() => handleMatrixOp('invA')}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-700 text-xs font-semibold text-cyan-300 transition"
            >
              A⁻¹ Inverse
            </button>
            <button
              onClick={() => handleMatrixOp('transA')}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-700 text-xs font-semibold text-cyan-300 transition"
            >
              Aᵀ Transpose
            </button>
            <button
              onClick={() => handleMatrixOp('rankA')}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-700 text-xs font-semibold text-cyan-300 transition"
            >
              Rank(A)
            </button>
          </div>

          {/* Result Card */}
          {matrixResult !== null && (
            <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-500/50 rounded-2xl shadow-md space-y-2">
              <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                {matrixOpTitle}
              </div>
              {Array.isArray(matrixResult) ? (
                <div
                  className="grid gap-2 max-w-sm"
                  style={{ gridTemplateColumns: `repeat(${matrixResult[0]?.length || matrixDim}, minmax(0, 1fr))` }}
                >
                  {matrixResult.map((row: any, r: number) =>
                    row.map((val: any, c: number) => (
                      <div
                        key={`res-${r}-${c}`}
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono font-bold text-emerald-300"
                      >
                        {typeof val === 'number' ? Number(val.toFixed(4)) : val}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="font-mono text-xl font-bold text-white">
                  {typeof matrixResult === 'object' ? JSON.stringify(matrixResult) : matrixResult}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Vector Tab */}
      {activeTab === 'vector' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vector u */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Vector u = (x, y, z)
              </h4>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                {(['x', 'y', 'z'] as const).map((axis, i) => (
                  <div key={axis}>
                    <label htmlFor={`vec-u-${axis}`} className="text-slate-400 block mb-1">{axis}:</label>
                    <input
                      id={`vec-u-${axis}`}
                      type="number"
                      value={vecU[i]}
                      onChange={e => {
                        const copy = [...vecU] as [number, number, number];
                        copy[i] = parseFloat(e.target.value) || 0;
                        setVecU(copy);
                      }}
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-center"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Vector v */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Vector v = (x, y, z)
              </h4>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                {(['x', 'y', 'z'] as const).map((axis, i) => (
                  <div key={axis}>
                    <label htmlFor={`vec-v-${axis}`} className="text-slate-400 block mb-1">{axis}:</label>
                    <input
                      id={`vec-v-${axis}`}
                      type="number"
                      value={vecV[i]}
                      onChange={e => {
                        const copy = [...vecV] as [number, number, number];
                        copy[i] = parseFloat(e.target.value) || 0;
                        setVecV(copy);
                      }}
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleVectorCompute}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Compute Vector Operations</span>
          </button>

          {vectorResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Dot Product (u · v)</span>
                <div className="font-mono text-lg font-bold text-cyan-300 mt-1">
                  {vectorResult.dot}
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Angle θ</span>
                <div className="font-mono text-lg font-bold text-emerald-400 mt-1">
                  {vectorResult.angleDeg}° ({vectorResult.angleRad} rad)
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Magnitude |u|</span>
                <div className="font-mono text-lg font-bold text-white mt-1">
                  {vectorResult.magU}
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Magnitude |v|</span>
                <div className="font-mono text-lg font-bold text-white mt-1">
                  {vectorResult.magV}
                </div>
              </div>

              <div className="col-span-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Cross Product (u × v)</span>
                <div className="font-mono text-base font-bold text-cyan-300 mt-1">
                  ({vectorResult.cross.join(', ')})
                </div>
              </div>

              <div className="col-span-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Vector Sum (u + v)</span>
                <div className="font-mono text-base font-bold text-white mt-1">
                  ({vectorResult.sum.join(', ')})
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
