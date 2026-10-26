/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as math from 'mathjs';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Camera,
  Eye,
  EyeOff,
  Activity,
  Plus,
  Trash2,
  HelpCircle,
} from 'lucide-react';
import { sanitizeExpression } from '../utils/mathEngine';

interface FunctionItem {
  id: string;
  expr: string;
  color: string;
  visible: boolean;
}

const PRESET_FUNCTIONS: { name: string; expr: string }[] = [
  { name: 'Sine wave', expr: 'sin(x)' },
  { name: 'Cubic polynomial', expr: 'x^3 - 3*x' },
  { name: 'Gaussian bell', expr: 'e^(-x^2)' },
  { name: 'Damped harmonic', expr: 'e^(-0.3*x) * sin(3*x)' },
  { name: 'Rational (1/x)', expr: '1/x' },
  { name: 'Absolute value', expr: 'abs(x) - 2' },
];

export const GraphingCalculator: React.FC<{
  onInsertToCalc?: (expr: string) => void;
}> = ({ onInsertToCalc }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Graph state: view bounds
  const [xMin, setXMin] = useState<number>(-10);
  const [xMax, setXMax] = useState<number>(10);
  const [yMin, setYMin] = useState<number>(-7);
  const [yMax, setYMax] = useState<number>(7);

  // Functions list
  const [functions, setFunctions] = useState<FunctionItem[]>([
    { id: '1', expr: 'x^3 - 3*x', color: '#06b6d4', visible: true },
    { id: '2', expr: '2*sin(x)', color: '#f59e0b', visible: false },
  ]);

  // Active tools
  const [traceActive, setTraceActive] = useState<boolean>(true);
  const [showTangent, setShowTangent] = useState<boolean>(false);
  const [traceX, setTraceX] = useState<number>(1);
  const [graphMode, setGraphMode] = useState<'cartesian' | 'polar'>('cartesian');

  // Dragging state
  const isDragging = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Key features found (roots and extrema)
  const [detectedPoints, setDetectedPoints] = useState<{
    roots: { x: number; y: number; fnIndex: number }[];
    extrema: { x: number; y: number; type: 'max' | 'min'; fnIndex: number }[];
  }>({ roots: [], extrema: [] });

  // Reset viewport
  const resetView = () => {
    setXMin(-10);
    setXMax(10);
    setYMin(-7);
    setYMax(7);
  };

  const zoom = (factor: number) => {
    const xCenter = (xMin + xMax) / 2;
    const yCenter = (yMin + yMax) / 2;
    const xSpan = (xMax - xMin) * factor;
    const ySpan = (yMax - yMin) * factor;
    setXMin(xCenter - xSpan / 2);
    setXMax(xCenter + xSpan / 2);
    setYMin(yCenter - ySpan / 2);
    setYMax(yCenter + ySpan / 2);
  };

  // Add / remove function
  const addFunction = () => {
    const colors = ['#10b981', '#ec4899', '#8b5cf6', '#3b82f6', '#f97316'];
    const color = colors[functions.length % colors.length];
    setFunctions(prev => [
      ...prev,
      { id: Date.now().toString(), expr: 'cos(x)', color, visible: true },
    ]);
  };

  const removeFunction = (id: string) => {
    if (functions.length <= 1) return;
    setFunctions(prev => prev.filter(f => f.id !== id));
  };

  const toggleFunctionVisibility = (id: string) => {
    setFunctions(prev =>
      prev.map(f => (f.id === id ? { ...f, visible: !f.visible } : f))
    );
  };

  const updateFunctionExpr = (id: string, newExpr: string) => {
    setFunctions(prev =>
      prev.map(f => (f.id === id ? { ...f, expr: newExpr } : f))
    );
  };

  // Draw graph on canvas
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Coordinate conversions
    const toScreenX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toScreenY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;
    const toMathX = (px: number) => xMin + (px / width) * (xMax - xMin);
    const toMathY = (py: number) => yMax - (py / height) * (yMax - yMin);

    // Clear background
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, width, height);

    // Grid spacing calculation
    const calcStep = (span: number) => {
      const raw = span / 10;
      const mag = Math.pow(10, Math.floor(Math.log10(raw)));
      const norm = raw / mag;
      if (norm < 1.5) return 1 * mag;
      if (norm < 3.5) return 2 * mag;
      if (norm < 7.5) return 5 * mag;
      return 10 * mag;
    };

    const xStep = calcStep(xMax - xMin);
    const yStep = calcStep(yMax - yMin);

    // Draw Grid
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e293b'; // slate-800
    ctx.fillStyle = '#64748b'; // slate-500
    ctx.font = '11px monospace';

    // Vertical grid lines & labels
    const firstX = Math.ceil(xMin / xStep) * xStep;
    for (let x = firstX; x <= xMax; x += xStep) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();

      if (Math.abs(x) > 1e-9) {
        const sy = Math.max(15, Math.min(height - 5, toScreenY(0) + 14));
        ctx.fillText(Number(x.toFixed(4)).toString(), sx + 2, sy);
      }
    }

    // Horizontal grid lines & labels
    const firstY = Math.ceil(yMin / yStep) * yStep;
    for (let y = firstY; y <= yMax; y += yStep) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();

      if (Math.abs(y) > 1e-9) {
        const sx = Math.max(5, Math.min(width - 45, toScreenX(0) + 4));
        ctx.fillText(Number(y.toFixed(4)).toString(), sx, sy - 3);
      }
    }

    // Draw Primary Axes
    ctx.strokeStyle = '#475569'; // slate-600
    ctx.lineWidth = 2;

    // X-Axis
    const originY = toScreenY(0);
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y-Axis
    const originX = toScreenX(0);
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Origin label
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('0', originX + 4, originY + 14);

    // Plot Functions
    const foundRoots: { x: number; y: number; fnIndex: number }[] = [];
    const foundExtrema: { x: number; y: number; type: 'max' | 'min'; fnIndex: number }[] = [];

    functions.forEach((fn, fnIdx) => {
      if (!fn.visible || !fn.expr.trim()) return;

      let compiled: any;
      try {
        const clean = sanitizeExpression(fn.expr);
        compiled = math.compile(clean);
      } catch {
        return;
      }

      ctx.save();
      ctx.strokeStyle = fn.color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.beginPath();

      let isDrawing = false;
      const numSteps = width * 1.5;
      let prevYVal: number | null = null;
      let prevDeriv: number | null = null;

      for (let i = 0; i <= numSteps; i++) {
        const px = (i / numSteps) * width;
        const x = toMathX(px);

        let yVal: number;
        try {
          if (graphMode === 'polar') {
            const theta = x;
            const r = compiled.evaluate({ theta, x, pi: Math.PI, e: Math.E });
            yVal = r * Math.sin(theta);
          } else {
            yVal = compiled.evaluate({ x, pi: Math.PI, e: Math.E });
          }
        } catch {
          isDrawing = false;
          continue;
        }

        if (!Number.isFinite(yVal) || Math.abs(yVal) > 1e6) {
          isDrawing = false;
          prevYVal = null;
          continue;
        }

        const py = toScreenY(yVal);

        // Discontinuity jump check
        if (prevYVal !== null && Math.abs(yVal - prevYVal) > (yMax - yMin) * 0.8) {
          isDrawing = false;
        }

        // Detect Root (zero crossing)
        if (prevYVal !== null && ((prevYVal < 0 && yVal >= 0) || (prevYVal > 0 && yVal <= 0))) {
          const rootX = x - (yVal * (x - toMathX(((i - 1) / numSteps) * width))) / (yVal - prevYVal);
          if (foundRoots.length < 8) {
            foundRoots.push({ x: rootX, y: 0, fnIndex: fnIdx });
          }
        }

        // Extrema detection via derivative sign change
        if (prevYVal !== null) {
          const dx = (xMax - xMin) / numSteps;
          const currentDeriv = (yVal - prevYVal) / dx;
          if (prevDeriv !== null) {
            if (prevDeriv > 0 && currentDeriv < 0 && foundExtrema.length < 8) {
              foundExtrema.push({ x, y: yVal, type: 'max', fnIndex: fnIdx });
            } else if (prevDeriv < 0 && currentDeriv > 0 && foundExtrema.length < 8) {
              foundExtrema.push({ x, y: yVal, type: 'min', fnIndex: fnIdx });
            }
          }
          prevDeriv = currentDeriv;
        }

        if (!isDrawing) {
          ctx.moveTo(px, py);
          isDrawing = true;
        } else {
          ctx.lineTo(px, py);
        }

        prevYVal = yVal;
      }

      ctx.stroke();
      ctx.restore();
    });

    setDetectedPoints({ roots: foundRoots, extrema: foundExtrema });

    // Mark Detected Roots (gold dots)
    foundRoots.forEach(r => {
      const sx = toScreenX(r.x);
      const sy = toScreenY(0);
      ctx.beginPath();
      ctx.arc(sx, sy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Mark Detected Extrema (purple dots)
    foundExtrema.forEach(e => {
      const sx = toScreenX(e.x);
      const sy = toScreenY(e.y);
      ctx.beginPath();
      ctx.arc(sx, sy, 4, 0, Math.PI * 2);
      ctx.fillStyle = e.type === 'max' ? '#38bdf8' : '#ec4899';
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Interactive Trace Crosshair & Coordinates
    if (traceActive) {
      const primaryFn = functions.find(f => f.visible && f.expr.trim());
      if (primaryFn) {
        try {
          const compiled = math.compile(sanitizeExpression(primaryFn.expr));
          const y = compiled.evaluate({ x: traceX, pi: Math.PI, e: Math.E });

          if (Number.isFinite(y)) {
            const sx = toScreenX(traceX);
            const sy = toScreenY(y);

            // Crosshair lines
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(sx, 0);
            ctx.lineTo(sx, height);
            ctx.moveTo(0, sy);
            ctx.lineTo(width, sy);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw Tangent Line if enabled
            if (showTangent) {
              const h = 1e-4;
              const slope = (compiled.evaluate({ x: traceX + h, pi: Math.PI, e: Math.E }) -
                             compiled.evaluate({ x: traceX - h, pi: Math.PI, e: Math.E })) / (2 * h);

              if (Number.isFinite(slope)) {
                ctx.strokeStyle = '#a855f7'; // Purple-500
                ctx.lineWidth = 1.5;
                const tangSpan = (xMax - xMin) * 0.3;
                const x1 = traceX - tangSpan;
                const y1 = y - slope * tangSpan;
                const x2 = traceX + tangSpan;
                const y2 = y + slope * tangSpan;

                ctx.beginPath();
                ctx.moveTo(toScreenX(x1), toScreenY(y1));
                ctx.lineTo(toScreenX(x2), toScreenY(y2));
                ctx.stroke();
              }
            }

            // Target Point Circle
            ctx.beginPath();
            ctx.arc(sx, sy, 6, 0, Math.PI * 2);
            ctx.fillStyle = primaryFn.color;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Readout Badge
            const label = `(${Number(traceX.toFixed(3))}, ${Number(y.toFixed(3))})`;
            ctx.font = 'bold 12px monospace';
            const textWidth = ctx.measureText(label).width;
            const badgeX = Math.min(width - textWidth - 20, Math.max(10, sx + 10));
            const badgeY = Math.max(25, Math.min(height - 15, sy - 15));

            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.strokeStyle = primaryFn.color;
            ctx.lineWidth = 1;
            ctx.fillRect(badgeX - 4, badgeY - 14, textWidth + 8, 20);
            ctx.strokeRect(badgeX - 4, badgeY - 14, textWidth + 8, 20);

            ctx.fillStyle = '#f8fafc';
            ctx.fillText(label, badgeX, badgeY);
          }
        } catch {
          // Ignore trace error
        }
      }
    }
  }, [xMin, xMax, yMin, yMax, functions, traceActive, traceX, showTangent, graphMode]);

  // Redraw when dependencies change
  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      drawGraph();
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [drawGraph]);

  // Mouse / Touch Dragging and Panning
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    if (isDragging.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      const xSpan = xMax - xMin;
      const ySpan = yMax - yMin;
      const mathDx = (dx / rect.width) * xSpan;
      const mathDy = (dy / rect.height) * ySpan;

      setXMin(prev => prev - mathDx);
      setXMax(prev => prev - mathDx);
      setYMin(prev => prev + mathDy);
      setYMax(prev => prev + mathDy);
    } else if (traceActive) {
      const px = e.clientX - rect.left;
      const mathX = xMin + (px / rect.width) * (xMax - xMin);
      setTraceX(mathX);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.15 : 0.85;
    zoom(factor);
  };

  // Export Screenshot
  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `scientific-graph-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl overflow-hidden border border-slate-800">
      {/* Top Graph Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs font-medium">
            <button
              onClick={() => setGraphMode('cartesian')}
              className={`px-2.5 py-1 rounded-md transition ${
                graphMode === 'cartesian' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              y = f(x)
            </button>
            <button
              onClick={() => setGraphMode('polar')}
              className={`px-2.5 py-1 rounded-md transition ${
                graphMode === 'polar' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              r = f(θ) Polar
            </button>
          </div>

          <button
            onClick={() => setTraceActive(!traceActive)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition ${
              traceActive
                ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Trace</span>
          </button>

          <button
            onClick={() => setShowTangent(!showTangent)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition ${
              showTangent
                ? 'bg-purple-950/70 border-purple-500/50 text-purple-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <span>Tangent dy/dx</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => zoom(0.8)}
            title="Zoom In"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => zoom(1.25)}
            title="Zoom Out"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            title="Reset Origin"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={exportImage}
            title="Export PNG"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative flex-1 w-full min-h-[300px] cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-full block"
        />

        {/* Feature Pill Tags */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5 pointer-events-none">
          {detectedPoints.roots.length > 0 && (
            <div className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono backdrop-blur-sm">
              Roots: {detectedPoints.roots.map(r => r.x.toFixed(2)).join(', ')}
            </div>
          )}
          {detectedPoints.extrema.length > 0 && (
            <div className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono backdrop-blur-sm">
              Extrema ({detectedPoints.extrema.length}): ({detectedPoints.extrema[0].x.toFixed(2)}, {detectedPoints.extrema[0].y.toFixed(2)})
            </div>
          )}
        </div>
      </div>

      {/* Functions Management Drawer */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 max-h-56 overflow-y-auto space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1">
          <span>FUNCTIONS (Multiple Graphs)</span>
          <button
            onClick={addFunction}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-700 hover:bg-cyan-600 text-white transition"
          >
            <Plus className="w-3 h-3" />
            <span>Add f(x)</span>
          </button>
        </div>

        {functions.map((fn, idx) => (
          <div key={fn.id} className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            <div
              className="w-3.5 h-3.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: fn.color }}
            />
            <span className="text-xs font-mono text-slate-400">f{idx + 1}(x)=</span>
            <input
              type="text"
              value={fn.expr}
              onChange={e => updateFunctionExpr(fn.id, e.target.value)}
              placeholder="e.g. sin(x) or x^2 - 4"
              className="flex-1 bg-transparent border-0 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 px-1"
            />
            <button
              onClick={() => toggleFunctionVisibility(fn.id)}
              className="text-slate-400 hover:text-white p-1"
            >
              {fn.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-slate-600" />}
            </button>
            {functions.length > 1 && (
              <button
                onClick={() => removeFunction(fn.id)}
                className="text-slate-500 hover:text-red-400 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        {/* Preset Function Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Presets:
          </span>
          {PRESET_FUNCTIONS.map(p => (
            <button
              key={p.name}
              onClick={() => {
                if (functions[0]) {
                  updateFunctionExpr(functions[0].id, p.expr);
                }
              }}
              className="px-2 py-0.5 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition"
            >
              {p.expr}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
