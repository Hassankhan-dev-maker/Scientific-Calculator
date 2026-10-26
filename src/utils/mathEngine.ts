/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as math from 'mathjs';

export type AngleMode = 'DEG' | 'RAD' | 'GRAD';
export type NumberFormat = 'normal' | 'scientific' | 'engineering';

export interface MathOptions {
  angleMode: AngleMode;
  precision: number;
  numberFormat?: NumberFormat;
  thousandsSeparator?: boolean;
  variables?: Record<string, number | any>;
}

export interface MathResult {
  success: boolean;
  raw: any;
  formatted: string;
  fraction?: string;
  scientific?: string;
  engineering?: string;
  type: 'number' | 'complex' | 'matrix' | 'unit' | 'boolean' | 'string' | 'error';
  error?: string;
}

/**
 * Converts angle value to radians based on the current mode
 */
export function toRadians(val: number, mode: AngleMode): number {
  if (mode === 'DEG') return (val * Math.PI) / 180;
  if (mode === 'GRAD') return (val * Math.PI) / 200;
  return val;
}

/**
 * Converts radians to current angle mode
 */
export function fromRadians(rad: number, mode: AngleMode): number {
  if (mode === 'DEG') return (rad * 180) / Math.PI;
  if (mode === 'GRAD') return (rad * 200) / Math.PI;
  return rad;
}

/**
 * Creates custom scope functions tailored to the selected AngleMode
 */
function createTrigScope(angleMode: AngleMode) {
  const scope: Record<string, any> = {};

  scope.sin = (x: number) => {
    const rad = toRadians(x, angleMode);
    // Handle exact zeroes for sin(180 deg) etc.
    const res = Math.sin(rad);
    return Math.abs(res) < 1e-15 ? 0 : res;
  };

  scope.cos = (x: number) => {
    const rad = toRadians(x, angleMode);
    // Handle exact zeroes for cos(90 deg) etc.
    const res = Math.cos(rad);
    return Math.abs(res) < 1e-15 ? 0 : res;
  };

  scope.tan = (x: number) => {
    const rad = toRadians(x, angleMode);
    const c = Math.cos(rad);
    if (Math.abs(c) < 1e-15) throw new Error('Undefined: division by zero in tan');
    const res = Math.tan(rad);
    return Math.abs(res) < 1e-15 ? 0 : res;
  };

  scope.asin = (x: number) => {
    if (x < -1 || x > 1) throw new Error('Domain error for asin: value must be between -1 and 1');
    return fromRadians(Math.asin(x), angleMode);
  };

  scope.acos = (x: number) => {
    if (x < -1 || x > 1) throw new Error('Domain error for acos: value must be between -1 and 1');
    return fromRadians(Math.acos(x), angleMode);
  };

  scope.atan = (x: number) => {
    return fromRadians(Math.atan(x), angleMode);
  };

  scope.atan2 = (y: number, x: number) => {
    return fromRadians(Math.atan2(y, x), angleMode);
  };

  scope.sec = (x: number) => {
    const c = scope.cos(x);
    if (c === 0) throw new Error('Undefined: sec at singularity');
    return 1 / c;
  };

  scope.csc = (x: number) => {
    const s = scope.sin(x);
    if (s === 0) throw new Error('Undefined: csc at singularity');
    return 1 / s;
  };

  scope.cot = (x: number) => {
    const s = scope.sin(x);
    if (s === 0) throw new Error('Undefined: cot at singularity');
    return scope.cos(x) / s;
  };

  scope.sinh = (x: number) => Math.sinh(x);
  scope.cosh = (x: number) => Math.cosh(x);
  scope.tanh = (x: number) => Math.tanh(x);
  scope.asinh = (x: number) => Math.asinh(x);
  scope.acosh = (x: number) => {
    if (x < 1) throw new Error('Domain error for acosh: value must be >= 1');
    return Math.acosh(x);
  };
  scope.atanh = (x: number) => {
    if (Math.abs(x) >= 1) throw new Error('Domain error for atanh: value must be in (-1, 1)');
    return Math.atanh(x);
  };

  // Permutations & Combinations
  scope.nPr = (n: number, r: number) => {
    if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) {
      throw new Error('nPr requires non-negative integers where n >= r');
    }
    return math.permutations(n, r);
  };

  scope.nCr = (n: number, r: number) => {
    if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) {
      throw new Error('nCr requires non-negative integers where n >= r');
    }
    return math.combinations(n, r);
  };

  // Percentage helper
  scope.percent = (x: number) => x / 100;

  // Custom log base helper
  scope.logBase = (x: number, base: number) => {
    if (x <= 0 || base <= 0 || base === 1) throw new Error('Invalid base or argument for logBase');
    return Math.log(x) / Math.log(base);
  };

  return scope;
}

/**
 * Preprocess user formula expression for robust mathjs parsing
 */
export function sanitizeExpression(rawExpr: string): string {
  let expr = rawExpr.trim();

  // Replace common unicode math symbols
  expr = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/–/g, '-')
    .replace(/π/g, 'pi')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/√\s*\(([^)]+)\)/g, 'sqrt($1)')
    .replace(/√([0-9a-zA-Z.]+)/g, 'sqrt($1)')
    .replace(/∛\s*\(([^)]+)\)/g, 'cbrt($1)')
    .replace(/∛([0-9a-zA-Z.]+)/g, 'cbrt($1)')
    .replace(/ln\(/g, 'log(')
    .replace(/log10\(/g, 'log10(')
    .replace(/abs\(([^)]+)\)/g, 'abs($1)')
    .replace(/\|([^|]+)\|/g, 'abs($1)');

  // Convert n! to factorial(n) or (expr)! to factorial(expr)
  expr = expr.replace(/(\d+(\.\d+)?|\([^)]+\))!/g, 'factorial($1)');

  // Convert trailing percentage (e.g. 25% -> (25/100))
  expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

  // Implicit multiplication: e.g. 2pi -> 2*pi, 4(3) -> 4*(3), (2)(3) -> (2)*(3), 5sqrt(2) -> 5*sqrt(2)
  expr = expr
    .replace(/\b(\d+(?:\.\d+)?)\s*(pi|e|sqrt|cbrt|sin|cos|tan|asin|acos|atan|log|ln|abs|\()/g, '$1*$2')
    .replace(/\)\s*\(/g, ')*(')
    .replace(/\)\s*(\d+|pi|e|[a-zA-Z])/g, ')*$1');

  return expr;
}

/**
 * Convert floating number to best rational fraction approximation
 */
export function toFraction(val: number, tolerance = 1e-9): string | undefined {
  if (!Number.isFinite(val) || Math.abs(val) > 1e9) return undefined;
  if (Number.isInteger(val)) return undefined;

  let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
  let b = val;
  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(val - h1 / k1) > val * tolerance && k1 < 100000);

  if (k1 > 1 && k1 <= 10000) {
    if (Math.abs(h1) > k1) {
      const whole = Math.trunc(h1 / k1);
      const rem = Math.abs(h1 % k1);
      return `${h1}/${k1} (${whole} ${rem}/${k1})`;
    }
    return `${h1}/${k1}`;
  }
  return undefined;
}

/**
 * Format engineering notation: exponent is multiple of 3
 */
export function toEngineering(val: number, precision: number): string {
  if (val === 0) return '0';
  const exp = Math.floor(Math.log10(Math.abs(val)));
  const engExp = Math.floor(exp / 3) * 3;
  const mantissa = val / Math.pow(10, engExp);
  const rounded = Number(mantissa.toFixed(Math.max(0, precision - 3)));
  return `${rounded} × 10^${engExp}`;
}

/**
 * Core expression evaluator
 */
export function evaluateExpression(rawExpr: string, options: MathOptions): MathResult {
  if (!rawExpr || !rawExpr.trim()) {
    return { success: true, raw: 0, formatted: '0', type: 'number' };
  }

  try {
    const cleanExpr = sanitizeExpression(rawExpr);
    const trigScope = createTrigScope(options.angleMode);
    const scope = { ...trigScope, ...(options.variables || {}) };

    const evaluated = math.evaluate(cleanExpr, scope);

    if (evaluated === undefined || evaluated === null) {
      return { success: false, raw: null, formatted: 'Undefined', type: 'error', error: 'Expression evaluated to undefined' };
    }

    // Handle Complex Numbers
    if (math.isComplex(evaluated)) {
      const re = Number(evaluated.re.toFixed(options.precision));
      const im = Number(evaluated.im.toFixed(options.precision));
      const r = Math.hypot(evaluated.re, evaluated.im);
      let phi = Math.atan2(evaluated.im, evaluated.re);
      if (options.angleMode === 'DEG') phi = (phi * 180) / Math.PI;

      const sign = im >= 0 ? '+' : '-';
      const formatted = `${re} ${sign} ${Math.abs(im)}i`;
      const polar = `${r.toFixed(4)} ∠ ${phi.toFixed(2)}${options.angleMode === 'DEG' ? '°' : ' rad'}`;

      return {
        success: true,
        raw: evaluated,
        formatted,
        scientific: polar,
        type: 'complex',
      };
    }

    // Handle Matrices
    if (math.isMatrix(evaluated) || Array.isArray(evaluated)) {
      const arr = math.isMatrix(evaluated) ? evaluated.toArray() : evaluated;
      const formatted = JSON.stringify(arr)
        .replace(/],\[/g, ']\n[')
        .replace(/\[\[/g, '[\n  [')
        .replace(/\]\]/g, ']\n]');
      return {
        success: true,
        raw: evaluated,
        formatted,
        type: 'matrix',
      };
    }

    // Handle Units
    if (math.isUnit(evaluated)) {
      return {
        success: true,
        raw: evaluated,
        formatted: evaluated.toString(),
        type: 'unit',
      };
    }

    // Handle Booleans
    if (typeof evaluated === 'boolean') {
      return {
        success: true,
        raw: evaluated,
        formatted: evaluated ? 'True' : 'False',
        type: 'boolean',
      };
    }

    // Handle Numbers
    const num = Number(evaluated);
    if (Number.isNaN(num)) {
      return { success: false, raw: num, formatted: 'NaN', type: 'error', error: 'Result is Not-a-Number (NaN)' };
    }

    if (!Number.isFinite(num)) {
      const sign = num > 0 ? 'Infinity' : '-Infinity';
      return { success: true, raw: num, formatted: sign, type: 'number' };
    }

    // Format number
    let formatted: string;
    const prec = Math.min(Math.max(options.precision, 2), 14);

    if (options.numberFormat === 'scientific') {
      formatted = num.toExponential(prec);
    } else if (options.numberFormat === 'engineering') {
      formatted = toEngineering(num, prec);
    } else {
      // Normal display: avoid floating point noise like 0.1 + 0.2 = 0.30000000000000004
      if (Math.abs(num) >= 1e12 || (Math.abs(num) > 0 && Math.abs(num) < 1e-6)) {
        formatted = num.toExponential(6);
      } else {
        formatted = Number(num.toFixed(prec)).toString();
      }
    }

    if (options.thousandsSeparator && options.numberFormat === 'normal' && !formatted.includes('e')) {
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      formatted = parts.join('.');
    }

    const fraction = toFraction(num);
    const scientific = num.toExponential(prec);
    const engineering = toEngineering(num, prec);

    return {
      success: true,
      raw: num,
      formatted,
      fraction,
      scientific,
      engineering,
      type: 'number',
    };
  } catch (err: any) {
    return {
      success: false,
      raw: null,
      formatted: 'Error',
      error: err?.message || 'Syntax Error',
      type: 'error',
    };
  }
}

/**
 * Numerical Differentiation using Central Difference algorithm
 * f'(x) = [f(x+h) - f(x-h)] / (2h)
 */
export function numericalDerivative(exprStr: string, xVal: number, order = 1, h = 1e-5): number {
  const cleanExpr = sanitizeExpression(exprStr);
  const compiled = math.compile(cleanExpr);

  const f = (x: number) => {
    try {
      return compiled.evaluate({ x, pi: Math.PI, e: Math.E });
    } catch {
      return NaN;
    }
  };

  if (order === 1) {
    return (f(xVal + h) - f(xVal - h)) / (2 * h);
  } else if (order === 2) {
    return (f(xVal + h) - 2 * f(xVal) + f(xVal - h)) / (h * h);
  }
  throw new Error('Order must be 1 or 2');
}

/**
 * Numerical Definite Integration using Adaptive Simpson's 1/3 Rule
 */
export function numericalIntegrate(exprStr: string, a: number, b: number, steps = 1000): number {
  if (a === b) return 0;
  const cleanExpr = sanitizeExpression(exprStr);
  const compiled = math.compile(cleanExpr);

  const f = (x: number) => {
    try {
      const val = compiled.evaluate({ x, pi: Math.PI, e: Math.E });
      return Number.isFinite(val) ? val : 0;
    } catch {
      return 0;
    }
  };

  // Ensure even number of steps
  const n = steps % 2 === 0 ? steps : steps + 1;
  const h = (b - a) / n;
  let sum = f(a) + f(b);

  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    sum += (i % 2 === 0 ? 2 : 4) * f(x);
  }

  return (h / 3) * sum;
}

/**
 * Numerical Limit calculation
 */
export function numericalLimit(exprStr: string, targetX: number, direction: 'left' | 'right' | 'both' = 'both'): {
  value: number | string;
  converges: boolean;
  leftVal?: number;
  rightVal?: number;
} {
  const cleanExpr = sanitizeExpression(exprStr);
  const compiled = math.compile(cleanExpr);
  const f = (x: number) => compiled.evaluate({ x, pi: Math.PI, e: Math.E });

  const epsilons = [1e-3, 1e-4, 1e-6, 1e-8];
  const rightVals = epsilons.map(eps => f(targetX + eps));
  const leftVals = epsilons.map(eps => f(targetX - eps));

  const rightLimit = rightVals[rightVals.length - 1];
  const leftLimit = leftVals[leftVals.length - 1];

  if (direction === 'right') {
    return { value: Number(rightLimit.toFixed(6)), converges: Number.isFinite(rightLimit), rightVal: rightLimit };
  }
  if (direction === 'left') {
    return { value: Number(leftLimit.toFixed(6)), converges: Number.isFinite(leftLimit), leftVal: leftLimit };
  }

  const diff = Math.abs(rightLimit - leftLimit);
  if (diff < 1e-4) {
    return { value: Number(((rightLimit + leftLimit) / 2).toFixed(6)), converges: true, leftVal: leftLimit, rightVal: rightLimit };
  }
  return { value: 'Does not exist (left != right)', converges: false, leftVal: leftLimit, rightVal: rightLimit };
}

/**
 * 1-Variable Statistics
 */
export interface Stats1Var {
  count: number;
  sum: number;
  mean: number;
  median: number;
  modes: number[];
  min: number;
  max: number;
  range: number;
  varianceSample: number;
  stdSample: number;
  variancePop: number;
  stdPop: number;
  q1: number;
  q3: number;
  iqr: number;
}

export function calculate1VarStats(data: number[]): Stats1Var | null {
  if (!data || data.length === 0) return null;
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;

  // Median
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Mode
  const freqMap: Record<number, number> = {};
  let maxFreq = 0;
  sorted.forEach(val => {
    freqMap[val] = (freqMap[val] || 0) + 1;
    if (freqMap[val] > maxFreq) maxFreq = freqMap[val];
  });
  const modes: number[] = [];
  if (maxFreq > 1) {
    for (const [key, freq] of Object.entries(freqMap)) {
      if (freq === maxFreq) modes.push(Number(key));
    }
  }

  // Variance & Standard Deviation
  const sqDiffs = sorted.map(v => (v - mean) ** 2);
  const sumSqDiff = sqDiffs.reduce((a, b) => a + b, 0);
  const variancePop = sumSqDiff / n;
  const stdPop = Math.sqrt(variancePop);
  const varianceSample = n > 1 ? sumSqDiff / (n - 1) : 0;
  const stdSample = Math.sqrt(varianceSample);

  // Quartiles
  const lowerHalf = sorted.slice(0, mid);
  const upperHalf = n % 2 !== 0 ? sorted.slice(mid + 1) : sorted.slice(mid);
  const calcMedian = (arr: number[]) => {
    if (arr.length === 0) return median;
    const m = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? arr[m] : (arr[m - 1] + arr[m]) / 2;
  };
  const q1 = calcMedian(lowerHalf);
  const q3 = calcMedian(upperHalf);

  return {
    count: n,
    sum,
    mean: Number(mean.toFixed(6)),
    median: Number(median.toFixed(6)),
    modes,
    min: sorted[0],
    max: sorted[n - 1],
    range: sorted[n - 1] - sorted[0],
    varianceSample: Number(varianceSample.toFixed(6)),
    stdSample: Number(stdSample.toFixed(6)),
    variancePop: Number(variancePop.toFixed(6)),
    stdPop: Number(stdPop.toFixed(6)),
    q1: Number(q1.toFixed(6)),
    q3: Number(q3.toFixed(6)),
    iqr: Number((q3 - q1).toFixed(6)),
  };
}

/**
 * 2-Variable Statistics & Linear Regression
 */
export interface Stats2Var {
  count: number;
  meanX: number;
  meanY: number;
  slope: number;
  intercept: number;
  correlationR: number;
  rSquared: number;
  equation: string;
}

export function calculateLinearRegression(xVals: number[], yVals: number[]): Stats2Var | null {
  const n = Math.min(xVals.length, yVals.length);
  if (n < 2) return null;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (let i = 0; i < n; i++) {
    const x = xVals[i];
    const y = yVals[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
    sumY2 += y * y;
  }

  const meanX = sumX / n;
  const meanY = sumY / n;
  const denominator = n * sumX2 - sumX * sumX;

  if (Math.abs(denominator) < 1e-12) return null;

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = meanY - slope * meanX;

  // Correlation r
  const rDenom = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const correlationR = rDenom !== 0 ? (n * sumXY - sumX * sumY) / rDenom : 0;
  const rSquared = correlationR * correlationR;

  const sign = intercept >= 0 ? '+' : '-';
  const equation = `y = ${slope.toFixed(4)}x ${sign} ${Math.abs(intercept).toFixed(4)}`;

  return {
    count: n,
    meanX: Number(meanX.toFixed(4)),
    meanY: Number(meanY.toFixed(4)),
    slope: Number(slope.toFixed(6)),
    intercept: Number(intercept.toFixed(6)),
    correlationR: Number(correlationR.toFixed(6)),
    rSquared: Number(rSquared.toFixed(6)),
    equation,
  };
}
