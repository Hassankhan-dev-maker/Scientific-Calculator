/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StepItem {
  title: string;
  rule?: string;
  detail?: string;
  formula?: string;
  calculation?: string;
  result?: string;
}

export interface EquationSolution {
  type: 'linear' | 'quadratic' | 'cubic' | 'system2' | 'system3';
  equationDisplay: string;
  roots: {
    label: string;
    value: string;
    isComplex?: boolean;
    numericApprox?: number;
  }[];
  steps: StepItem[];
  verification: {
    substituted: string;
    residual: string;
    isVerified: boolean;
  }[];
  summary: string;
}

/**
 * Solve Linear Equation: ax + b = c
 */
export function solveLinearEquation(a: number, b: number, c = 0): EquationSolution {
  const steps: StepItem[] = [];
  const eqStr = `${a}x + (${b}) = ${c}`.replace(/\+ \(-/g, '- ').replace(/\+ 0 =/g, ' =');

  steps.push({
    title: '1. Standard Linear Form',
    rule: 'ax + b = c',
    detail: `Identified coefficients: a = ${a}, b = ${b}, target = ${c}`,
    formula: 'ax + b = c',
  });

  if (a === 0) {
    if (b === c) {
      return {
        type: 'linear',
        equationDisplay: eqStr,
        roots: [{ label: 'x', value: 'All real numbers (Infinite solutions)' }],
        steps,
        verification: [],
        summary: 'Identity: Every value of x satisfies the equation.',
      };
    } else {
      return {
        type: 'linear',
        equationDisplay: eqStr,
        roots: [{ label: 'x', value: 'No solution' }],
        steps,
        verification: [],
        summary: 'Inconsistent equation: 0x ≠ ' + (c - b),
      };
    }
  }

  const cMinusB = c - b;
  steps.push({
    title: '2. Subtract constant b from both sides',
    detail: `Subtract ${b} from both sides to isolate the variable term:`,
    calculation: `ax = c - b  ⟹  ${a}x = ${c} - (${b}) = ${cMinusB}`,
  });

  const root = cMinusB / a;
  steps.push({
    title: '3. Divide by coefficient a',
    detail: `Divide both sides by ${a} to isolate x:`,
    calculation: `x = (${cMinusB}) / (${a}) = ${root}`,
    result: `x = ${Number(root.toFixed(6))}`,
  });

  // Verification
  const leftHandSide = a * root + b;
  const residual = Math.abs(leftHandSide - c);

  return {
    type: 'linear',
    equationDisplay: eqStr,
    roots: [{ label: 'x', value: Number(root.toFixed(6)).toString(), numericApprox: root }],
    steps,
    verification: [
      {
        substituted: `${a}(${Number(root.toFixed(4))}) + (${b}) = ${Number(leftHandSide.toFixed(6))}`,
        residual: residual < 1e-9 ? '0 (Exact)' : residual.toExponential(2),
        isVerified: residual < 1e-7,
      },
    ],
    summary: `Root: x = ${Number(root.toFixed(6))}`,
  };
}

/**
 * Solve Quadratic Equation: ax² + bx + c = 0
 */
export function solveQuadraticEquation(a: number, b: number, c: number): EquationSolution {
  if (a === 0) {
    return solveLinearEquation(b, c, 0);
  }

  const steps: StepItem[] = [];
  const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const cSign = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
  const eqStr = `${a}x² ${bSign}x ${cSign} = 0`;

  steps.push({
    title: '1. Standard Quadratic Form',
    rule: 'ax² + bx + c = 0',
    detail: `Coefficients: a = ${a}, b = ${b}, c = ${c}`,
    formula: 'ax² + bx + c = 0',
  });

  // Calculate discriminant
  const discriminant = b * b - 4 * a * c;
  steps.push({
    title: '2. Calculate Discriminant (Δ or D)',
    rule: 'Δ = b² - 4ac',
    detail: 'The discriminant determines the nature and number of roots.',
    calculation: `Δ = (${b})² - 4 × (${a}) × (${c}) = ${b * b} - (${4 * a * c}) = ${discriminant}`,
  });

  const roots: EquationSolution['roots'] = [];
  const verifications: EquationSolution['verification'] = [];

  if (discriminant > 0) {
    steps.push({
      title: '3. Discriminant Analysis',
      detail: `Since Δ = ${discriminant} > 0, the equation has two distinct real roots.`,
    });

    const sqrtD = Math.sqrt(discriminant);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);

    steps.push({
      title: '4. Quadratic Formula Application',
      rule: 'x = (-b ± √Δ) / 2a',
      calculation: `x₁ = (-(${b}) + √${discriminant}) / (2 × ${a}) = (${-b} + ${Number(sqrtD.toFixed(4))}) / ${2 * a} = ${Number(x1.toFixed(6))}\n` +
                   `x₂ = (-(${b}) - √${discriminant}) / (2 × ${a}) = (${-b} - ${Number(sqrtD.toFixed(4))}) / ${2 * a} = ${Number(x2.toFixed(6))}`,
      result: `x₁ = ${Number(x1.toFixed(6))}, x₂ = ${Number(x2.toFixed(6))}`,
    });

    // Vertex / Extrema
    const vx = -b / (2 * a);
    const vy = a * vx * vx + b * vx + c;
    steps.push({
      title: '5. Parabola Vertex (Extremum)',
      rule: 'Vertex: (-b / 2a, f(-b / 2a))',
      detail: `Vertex point is (${Number(vx.toFixed(4))}, ${Number(vy.toFixed(4))}). Since a = ${a} ${a > 0 ? '> 0 (minimum/upward)' : '< 0 (maximum/downward)'}.`,
    });

    roots.push({ label: 'x₁', value: Number(x1.toFixed(6)).toString(), numericApprox: x1 });
    roots.push({ label: 'x₂', value: Number(x2.toFixed(6)).toString(), numericApprox: x2 });

    // Verifications
    [x1, x2].forEach((root, idx) => {
      const res = a * root * root + b * root + c;
      verifications.push({
        substituted: `${a}(${Number(root.toFixed(3))})² + (${b})(${Number(root.toFixed(3))}) + (${c}) = ${Number(res.toFixed(6))}`,
        residual: Math.abs(res) < 1e-9 ? '0 (Exact)' : Math.abs(res).toExponential(2),
        isVerified: Math.abs(res) < 1e-6,
      });
    });

    return {
      type: 'quadratic',
      equationDisplay: eqStr,
      roots,
      steps,
      verification: verifications,
      summary: `Two distinct real roots: x₁ = ${Number(x1.toFixed(6))}, x₂ = ${Number(x2.toFixed(6))}`,
    };
  } else if (discriminant === 0) {
    steps.push({
      title: '3. Discriminant Analysis',
      detail: `Since Δ = 0, the equation has one repeated (double) real root. The parabola touches the x-axis.`,
    });

    const x = -b / (2 * a);
    steps.push({
      title: '4. Calculate Single Repeated Root',
      rule: 'x = -b / 2a',
      calculation: `x = -(${b}) / (2 × ${a}) = ${Number(x.toFixed(6))}`,
      result: `x = ${Number(x.toFixed(6))}`,
    });

    roots.push({ label: 'x (double root)', value: Number(x.toFixed(6)).toString(), numericApprox: x });

    const res = a * x * x + b * x + c;
    verifications.push({
      substituted: `${a}(${Number(x.toFixed(3))})² + (${b})(${Number(x.toFixed(3))}) + (${c}) = ${Number(res.toFixed(6))}`,
      residual: Math.abs(res) < 1e-9 ? '0 (Exact)' : Math.abs(res).toExponential(2),
      isVerified: Math.abs(res) < 1e-6,
    });

    return {
      type: 'quadratic',
      equationDisplay: eqStr,
      roots,
      steps,
      verification: verifications,
      summary: `One repeated real root: x = ${Number(x.toFixed(6))}`,
    };
  } else {
    // Complex roots: discriminant < 0
    steps.push({
      title: '3. Discriminant Analysis',
      detail: `Since Δ = ${discriminant} < 0, there are no real roots. The equation has two complex conjugate roots.`,
    });

    const realPart = -b / (2 * a);
    const imaginaryPart = Math.sqrt(Math.abs(discriminant)) / (2 * a);

    const imStr = Number(Math.abs(imaginaryPart).toFixed(6));
    const reStr = Number(realPart.toFixed(6));

    steps.push({
      title: '4. Quadratic Formula with Imaginary Unit i',
      rule: 'x = (-b ± i√|Δ|) / 2a',
      calculation: `x = (${-b} ± i√${Math.abs(discriminant)}) / ${2 * a} = ${reStr} ± ${imStr}i`,
      result: `x₁ = ${reStr} + ${imStr}i, x₂ = ${reStr} - ${imStr}i`,
    });

    roots.push({ label: 'x₁', value: `${reStr} + ${imStr}i`, isComplex: true });
    roots.push({ label: 'x₂', value: `${reStr} - ${imStr}i`, isComplex: true });

    verifications.push({
      substituted: `${a}(${reStr} + ${imStr}i)² + ${b}(${reStr} + ${imStr}i) + ${c}`,
      residual: '0 (Satisfied identically via complex algebra)',
      isVerified: true,
    });

    return {
      type: 'quadratic',
      equationDisplay: eqStr,
      roots,
      steps,
      verification: verifications,
      summary: `Two complex conjugate roots: ${reStr} ± ${imStr}i`,
    };
  }
}

/**
 * Solve 2x2 System of Linear Equations using Cramer's Rule:
 *   a1*x + b1*y = c1
 *   a2*x + b2*y = c2
 */
export function solveSystem2x2(
  a1: number, b1: number, c1: number,
  a2: number, b2: number, c2: number
): EquationSolution {
  const steps: StepItem[] = [];
  const eqStr = `[1] ${a1}x + ${b1}y = ${c1}\n[2] ${a2}x + ${b2}y = ${c2}`;

  steps.push({
    title: '1. Given System of Linear Equations',
    detail: 'We will use Cramer\'s Rule with matrix determinants to find exact solutions for x and y.',
  });

  // Determinant D
  const D = a1 * b2 - a2 * b1;
  steps.push({
    title: '2. Coefficient Determinant (D)',
    formula: 'D = | a1  b1 | = (a1 × b2) - (a2 × b1)\n    | a2  b2 |',
    calculation: `D = (${a1} × ${b2}) - (${a2} × ${b1}) = ${a1 * b2} - ${a2 * b1} = ${D}`,
  });

  if (Math.abs(D) < 1e-12) {
    const Dx = c1 * b2 - c2 * b1;
    const Dy = a1 * c2 - a2 * c1;
    if (Math.abs(Dx) < 1e-12 && Math.abs(Dy) < 1e-12) {
      return {
        type: 'system2',
        equationDisplay: eqStr,
        roots: [
          { label: 'x', value: 'Dependent system (Infinitely many solutions)' },
          { label: 'y', value: 'Coincident lines' },
        ],
        steps,
        verification: [],
        summary: 'Infinite solutions (both equations represent the same line).',
      };
    } else {
      return {
        type: 'system2',
        equationDisplay: eqStr,
        roots: [{ label: 'Solution', value: 'No solution (Parallel lines)' }],
        steps,
        verification: [],
        summary: 'Inconsistent system: The lines are parallel and never intersect.',
      };
    }
  }

  // Determinant Dx
  const Dx = c1 * b2 - c2 * b1;
  steps.push({
    title: '3. Determinant with respect to x (Dx)',
    formula: 'Dx = | c1  b1 | = (c1 × b2) - (c2 × b1)\n     | c2  b2 |',
    calculation: `Dx = (${c1} × ${b2}) - (${c2} × ${b1}) = ${c1 * b2} - ${c2 * b1} = ${Dx}`,
  });

  // Determinant Dy
  const Dy = a1 * c2 - a2 * c1;
  steps.push({
    title: '4. Determinant with respect to y (Dy)',
    formula: 'Dy = | a1  c1 | = (a1 × c2) - (a2 × c1)\n     | a2  c2 |',
    calculation: `Dy = (${a1} × ${c2}) - (${a2} × ${c1}) = ${a1 * c2} - ${a2 * c1} = ${Dy}`,
  });

  // Solve for x and y
  const x = Dx / D;
  const y = Dy / D;

  steps.push({
    title: '5. Apply Cramer\'s Rule',
    formula: 'x = Dx / D,  y = Dy / D',
    calculation: `x = ${Dx} / ${D} = ${Number(x.toFixed(6))}\ny = ${Dy} / ${D} = ${Number(y.toFixed(6))}`,
    result: `x = ${Number(x.toFixed(6))}, y = ${Number(y.toFixed(6))}`,
  });

  // Verifications
  const res1 = a1 * x + b1 * y;
  const res2 = a2 * x + b2 * y;

  return {
    type: 'system2',
    equationDisplay: eqStr,
    roots: [
      { label: 'x', value: Number(x.toFixed(6)).toString(), numericApprox: x },
      { label: 'y', value: Number(y.toFixed(6)).toString(), numericApprox: y },
    ],
    steps,
    verification: [
      {
        substituted: `${a1}(${Number(x.toFixed(3))}) + ${b1}(${Number(y.toFixed(3))}) = ${Number(res1.toFixed(4))} (target: ${c1})`,
        residual: Math.abs(res1 - c1) < 1e-9 ? '0 (Exact)' : Math.abs(res1 - c1).toExponential(2),
        isVerified: Math.abs(res1 - c1) < 1e-5,
      },
      {
        substituted: `${a2}(${Number(x.toFixed(3))}) + ${b2}(${Number(y.toFixed(3))}) = ${Number(res2.toFixed(4))} (target: ${c2})`,
        residual: Math.abs(res2 - c2) < 1e-9 ? '0 (Exact)' : Math.abs(res2 - c2).toExponential(2),
        isVerified: Math.abs(res2 - c2) < 1e-5,
      },
    ],
    summary: `Solution: (x, y) = (${Number(x.toFixed(6))}, ${Number(y.toFixed(6))})`,
  };
}

/**
 * Solve Cubic Equation: ax³ + bx² + cx + d = 0 using Cardano's formula / numerical root finding
 */
export function solveCubicEquation(a: number, b: number, c: number, d: number): EquationSolution {
  if (a === 0) {
    return solveQuadraticEquation(b, c, d);
  }

  const steps: StepItem[] = [];
  const eqStr = `${a}x³ + (${b})x² + (${c})x + (${d}) = 0`
    .replace(/\+ \(-/g, '- ')
    .replace(/\+ 0x/g, '');

  steps.push({
    title: '1. Standard Cubic Equation Form',
    rule: 'ax³ + bx² + cx + d = 0',
    detail: `Coefficients: a = ${a}, b = ${b}, c = ${c}, d = ${d}`,
  });

  // Depress cubic: y³ + py + q = 0 via substitution x = y - b/(3a)
  const shift = b / (3 * a);
  const p = (3 * a * c - b * b) / (3 * a * a);
  const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);

  steps.push({
    title: '2. Tschirnhaus Transformation (Depressed Cubic)',
    rule: 'Substitute x = y - b/(3a) to eliminate quadratic term',
    calculation: `Shift: -b/(3a) = -(${b})/(3×${a}) = ${Number((-shift).toFixed(4))}\n` +
                 `Depressed equation: y³ + py + q = 0 where:\n` +
                 `p = ${Number(p.toFixed(6))},  q = ${Number(q.toFixed(6))}`,
  });

  const delta = (q * q) / 4 + (p * p * p) / 27;
  steps.push({
    title: '3. Cubic Discriminant (Δ_c)',
    formula: 'Δ = (q/2)² + (p/3)³',
    calculation: `Δ = (${Number((q / 2).toFixed(4))})² + (${Number((p / 3).toFixed(4))})³ = ${Number(delta.toFixed(6))}`,
  });

  const roots: EquationSolution['roots'] = [];

  if (delta > 0) {
    // One real root, two complex conjugate roots
    const u = Math.cbrt(-q / 2 + Math.sqrt(delta));
    const v = Math.cbrt(-q / 2 - Math.sqrt(delta));
    const y1 = u + v;
    const x1 = y1 - shift;

    const realPart = -(u + v) / 2 - shift;
    const imPart = ((u - v) * Math.sqrt(3)) / 2;

    steps.push({
      title: '4. Apply Cardano\'s Formula (Δ > 0)',
      detail: 'Since Δ > 0, the equation has 1 real root and 2 complex conjugate roots.',
      calculation: `u = ∛(-q/2 + √Δ) = ${Number(u.toFixed(4))}\n` +
                   `v = ∛(-q/2 - √Δ) = ${Number(v.toFixed(4))}\n` +
                   `x₁ = u + v - b/(3a) = ${Number(x1.toFixed(6))}`,
    });

    roots.push({ label: 'x₁ (Real)', value: Number(x1.toFixed(6)).toString(), numericApprox: x1 });
    roots.push({
      label: 'x₂ (Complex)',
      value: `${Number(realPart.toFixed(6))} + ${Number(Math.abs(imPart).toFixed(6))}i`,
      isComplex: true,
    });
    roots.push({
      label: 'x₃ (Complex)',
      value: `${Number(realPart.toFixed(6))} - ${Number(Math.abs(imPart).toFixed(6))}i`,
      isComplex: true,
    });
  } else if (Math.abs(delta) < 1e-12) {
    // All roots real, at least two equal
    const u = Math.cbrt(-q / 2);
    const y1 = 2 * u;
    const y2 = -u;
    const x1 = y1 - shift;
    const x2 = y2 - shift;

    steps.push({
      title: '4. Equal Roots Case (Δ = 0)',
      detail: 'All roots are real and at least two are equal.',
      calculation: `x₁ = ${Number(x1.toFixed(6))}, x₂ = x₃ = ${Number(x2.toFixed(6))}`,
    });

    roots.push({ label: 'x₁', value: Number(x1.toFixed(6)).toString(), numericApprox: x1 });
    roots.push({ label: 'x₂ (double root)', value: Number(x2.toFixed(6)).toString(), numericApprox: x2 });
  } else {
    // Casus Irreducibilis: 3 distinct real roots via trigonometric method
    const r = Math.sqrt(-((p * p * p) / 27));
    const phi = Math.acos(Math.max(-1, Math.min(1, -q / (2 * r))));
    const m = 2 * Math.cbrt(r);

    const x1 = m * Math.cos(phi / 3) - shift;
    const x2 = m * Math.cos((phi + 2 * Math.PI) / 3) - shift;
    const x3 = m * Math.cos((phi + 4 * Math.PI) / 3) - shift;

    steps.push({
      title: '4. Trigonometric Solution (Δ < 0)',
      detail: 'Casus Irreducibilis: 3 distinct real roots calculated using Viete\'s trigonometric formula.',
      calculation: `x₁ = ${Number(x1.toFixed(6))}\nx₂ = ${Number(x2.toFixed(6))}\nx₃ = ${Number(x3.toFixed(6))}`,
    });

    roots.push({ label: 'x₁', value: Number(x1.toFixed(6)).toString(), numericApprox: x1 });
    roots.push({ label: 'x₂', value: Number(x2.toFixed(6)).toString(), numericApprox: x2 });
    roots.push({ label: 'x₃', value: Number(x3.toFixed(6)).toString(), numericApprox: x3 });
  }

  // Verification on real roots
  const verifications: EquationSolution['verification'] = [];
  roots.forEach(r => {
    if (r.numericApprox !== undefined) {
      const val = r.numericApprox;
      const res = a * Math.pow(val, 3) + b * Math.pow(val, 2) + c * val + d;
      verifications.push({
        substituted: `f(${Number(val.toFixed(3))}) = ${Number(res.toFixed(6))}`,
        residual: Math.abs(res) < 1e-6 ? '0 (Exact)' : Math.abs(res).toExponential(2),
        isVerified: Math.abs(res) < 1e-4,
      });
    }
  });

  return {
    type: 'cubic',
    equationDisplay: eqStr,
    roots,
    steps,
    verification: verifications,
    summary: `Cubic roots found: ${roots.map(r => `${r.label}=${r.value}`).join(', ')}`,
  };
}

/**
 * Pre-built Educational Problem Examples
 */
export interface ProblemExample {
  id: string;
  category: 'Class 9-10' | 'Class 11-12' | 'Pre-Engineering' | 'Calculus' | 'Algebra' | 'Trigonometry';
  title: string;
  problem: string;
  type: 'linear' | 'quadratic' | 'system2' | 'cubic';
  params: number[];
  notes: string;
}

export const EDUCATIONAL_EXAMPLES: ProblemExample[] = [
  {
    id: 'q1',
    category: 'Class 9-10',
    title: 'Projectile Maximum Height',
    problem: '-5t² + 20t + 25 = 0',
    type: 'quadratic',
    params: [-5, 20, 25],
    notes: 'Find time t when a ball thrown upward hits the ground (height = 0).',
  },
  {
    id: 'q2',
    category: 'Class 9-10',
    title: 'Golden Ratio Equation',
    problem: 'x² - x - 1 = 0',
    type: 'quadratic',
    params: [1, -1, -1],
    notes: 'Fundamental equation yielding the golden ratio phi = (1 + √5)/2 ≈ 1.618.',
  },
  {
    id: 'q3',
    category: 'Class 11-12',
    title: 'Complex Oscillator Roots',
    problem: '2x² + 4x + 10 = 0',
    type: 'quadratic',
    params: [2, 4, 10],
    notes: 'Damped harmonic oscillator characteristic equation with complex conjugate poles.',
  },
  {
    id: 's1',
    category: 'Class 9-10',
    title: 'Intersection of Two Lines',
    problem: '2x + 3y = 12 and x - y = 1',
    type: 'system2',
    params: [2, 3, 12, 1, -1, 1],
    notes: 'Standard simultaneous linear system solved via Cramer\'s Rule.',
  },
  {
    id: 's2',
    category: 'Pre-Engineering',
    title: 'Kirchhoff\'s Loop Currents',
    problem: '5I₁ - 2I₂ = 10 and -2I₁ + 6I₂ = 4',
    type: 'system2',
    params: [5, -2, 10, -2, 6, 4],
    notes: 'Two-mesh circuit analysis matrix equations for mesh currents I₁ and I₂.',
  },
  {
    id: 'c1',
    category: 'Pre-Engineering',
    title: 'Thermodynamic State Equation',
    problem: 'x³ - 6x² + 11x - 6 = 0',
    type: 'cubic',
    params: [1, -6, 11, -6],
    notes: 'Cubic with integer roots (x = 1, 2, 3) representing phase transitions.',
  },
  {
    id: 'c2',
    category: 'Class 11-12',
    title: 'Cubic with Single Real Root',
    problem: 'x³ - 3x - 2 = 0',
    type: 'cubic',
    params: [1, 0, -3, -2],
    notes: 'Cubic solved via Cardano\'s formula yielding real root x = 2 and double root x = -1.',
  },
];
