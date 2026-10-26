/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateExpression,
  numericalDerivative,
  numericalIntegrate,
  calculate1VarStats,
  calculateLinearRegression,
} from './mathEngine';
import {
  solveLinearEquation,
  solveQuadraticEquation,
  solveSystem2x2,
} from './equationSolver';
import {
  formatAllBases,
  bitwiseOp,
  parseByBase,
} from './programmerEngine';
import { convertUnits } from './converterData';

test('Basic Arithmetic & Operator Precedence', () => {
  const r1 = evaluateExpression('2 + 3 * 4', { angleMode: 'DEG', precision: 6 });
  assert.equal(r1.success, true);
  assert.equal(r1.formatted, '14');

  const r2 = evaluateExpression('(2 + 3) * 4', { angleMode: 'DEG', precision: 6 });
  assert.equal(r2.success, true);
  assert.equal(r2.formatted, '20');

  const r3 = evaluateExpression('10 / 4', { angleMode: 'DEG', precision: 6 });
  assert.equal(r3.success, true);
  assert.equal(r3.formatted, '2.5');
  assert.ok(r3.fraction?.includes('5/2'));

  const r4 = evaluateExpression('2^3^2', { angleMode: 'DEG', precision: 6 });
  assert.equal(r4.success, true);
});

test('Trigonometry in DEG and RAD Modes', () => {
  const degSin = evaluateExpression('sin(30)', { angleMode: 'DEG', precision: 6 });
  assert.equal(degSin.success, true);
  assert.equal(Number(degSin.formatted), 0.5);

  const degCos = evaluateExpression('cos(60)', { angleMode: 'DEG', precision: 6 });
  assert.equal(degCos.success, true);
  assert.equal(Number(degCos.formatted), 0.5);

  const degTan = evaluateExpression('tan(45)', { angleMode: 'DEG', precision: 6 });
  assert.equal(degTan.success, true);
  assert.equal(Number(degTan.formatted), 1);

  const radSin = evaluateExpression('sin(pi / 6)', { angleMode: 'RAD', precision: 6 });
  assert.equal(radSin.success, true);
  assert.equal(Number(radSin.formatted), 0.5);

  const asinDeg = evaluateExpression('asin(0.5)', { angleMode: 'DEG', precision: 6 });
  assert.equal(asinDeg.success, true);
  assert.equal(Number(asinDeg.formatted), 30);
});

test('Powers, Roots, Logarithms and Factorials', () => {
  const sqrtRes = evaluateExpression('sqrt(144) + cbrt(27)', { angleMode: 'DEG', precision: 6 });
  assert.equal(sqrtRes.success, true);
  assert.equal(Number(sqrtRes.formatted), 15);

  const logRes = evaluateExpression('log10(1000) + log(e)', { angleMode: 'DEG', precision: 6 });
  assert.equal(logRes.success, true);
  assert.equal(Number(logRes.formatted), 4);

  const factRes = evaluateExpression('5!', { angleMode: 'DEG', precision: 6 });
  assert.equal(factRes.success, true);
  assert.equal(Number(factRes.formatted), 120);

  const combRes = evaluateExpression('nCr(5, 2)', { angleMode: 'DEG', precision: 6 });
  assert.equal(combRes.success, true);
  assert.equal(Number(combRes.formatted), 10);
});

test('Complex Numbers', () => {
  const res = evaluateExpression('(3 + 4i) + (1 - 2i)', { angleMode: 'DEG', precision: 6 });
  assert.equal(res.success, true);
  assert.equal(res.type, 'complex');
  assert.ok(res.formatted.includes('4 + 2i'));
});

test('Calculus: Numerical Derivative & Definite Integral', () => {
  // Derivative of x^2 at x = 3 is 2*3 = 6
  const deriv = numericalDerivative('x^2', 3);
  assert.ok(Math.abs(deriv - 6) < 1e-4, `Expected derivative ~6, got ${deriv}`);

  // Integral of x^2 from 0 to 3 is [x^3/3] = 9
  const intVal = numericalIntegrate('x^2', 0, 3);
  assert.ok(Math.abs(intVal - 9) < 1e-4, `Expected integral ~9, got ${intVal}`);
});

test('Statistics: 1-Variable & 2-Variable Regression', () => {
  const data = [10, 20, 20, 40, 50];
  const stats = calculate1VarStats(data);
  assert.ok(stats);
  assert.equal(stats.count, 5);
  assert.equal(stats.mean, 28);
  assert.equal(stats.median, 20);
  assert.deepEqual(stats.modes, [20]);

  const xVals = [1, 2, 3, 4, 5];
  const yVals = [2, 4, 6, 8, 10];
  const reg = calculateLinearRegression(xVals, yVals);
  assert.ok(reg);
  assert.equal(reg.slope, 2);
  assert.equal(reg.intercept, 0);
  assert.equal(reg.correlationR, 1);
});

test('Equation Solver: Linear, Quadratic, and 2x2 System', () => {
  // Linear 2x - 8 = 0 -> x = 4
  const lin = solveLinearEquation(2, -8, 0);
  assert.equal(lin.roots[0].value, '4');
  assert.equal(lin.verification[0].isVerified, true);

  // Quadratic x^2 - 5x + 6 = 0 -> x1 = 3, x2 = 2
  const quad = solveQuadraticEquation(1, -5, 6);
  assert.equal(quad.roots.length, 2);
  assert.ok(quad.roots.some(r => r.value === '3'));
  assert.ok(quad.roots.some(r => r.value === '2'));
  assert.ok(quad.verification.every(v => v.isVerified));

  // Complex roots: x^2 + 4 = 0 -> 0 +- 2i
  const quadC = solveQuadraticEquation(1, 0, 4);
  assert.ok(quadC.roots[0].isComplex);

  // System: 2x + 3y = 8 and x - y = -1 -> x = 1, y = 2
  const sys = solveSystem2x2(2, 3, 8, 1, -1, -1);
  assert.equal(sys.roots[0].value, '1');
  assert.equal(sys.roots[1].value, '2');
  assert.ok(sys.verification.every(v => v.isVerified));
});

test('Programmer Mode: Base conversion & Bitwise', () => {
  const val = 42n;
  const bases = formatAllBases(val, 8, false);
  assert.equal(bases.dec, '42');
  assert.equal(bases.hexRaw, '2A');
  assert.equal(bases.octRaw, '52');
  assert.equal(bases.binRaw, '00101010');

  const andRes = bitwiseOp('AND', 0b1100n, 0b1010n, 8);
  assert.equal(andRes, 0b1000n);

  const orRes = bitwiseOp('OR', 0b1100n, 0b1010n, 8);
  assert.equal(orRes, 0b1110n);

  const xorRes = bitwiseOp('XOR', 0b1100n, 0b1010n, 8);
  assert.equal(xorRes, 0b0110n);
});

test('Unit Converter: Length and Temperature', () => {
  const kmToM = convertUnits(5, 'length', 'km', 'm');
  assert.ok(kmToM);
  assert.equal(kmToM.result, 5000);

  const cToF = convertUnits(100, 'temperature', 'c', 'f');
  assert.ok(cToF);
  assert.equal(cToF.result, 212);

  const fToC = convertUnits(32, 'temperature', 'f', 'c');
  assert.ok(fToC);
  assert.equal(fToC.result, 0);
});
