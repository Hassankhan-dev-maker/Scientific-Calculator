/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FormulaItem {
  id: string;
  category: string;
  title: string;
  expression: string;
  explanation: string;
  variables: { name: string; meaning: string; unit?: string }[];
  templateInput?: string;
}

export const FORMULA_LIBRARY: FormulaItem[] = [
  // Algebra
  {
    id: 'alg-quad',
    category: 'Algebra',
    title: 'Quadratic Formula',
    expression: 'x = (-b ± √(b² - 4ac)) / (2a)',
    explanation: 'Finds the roots of any polynomial quadratic equation ax² + bx + c = 0.',
    variables: [
      { name: 'a', meaning: 'Quadratic coefficient (a ≠ 0)' },
      { name: 'b', meaning: 'Linear coefficient' },
      { name: 'c', meaning: 'Constant term' },
    ],
  },
  {
    id: 'alg-binom',
    category: 'Algebra',
    title: 'Binomial Theorem',
    expression: '(a + b)ⁿ = Σₖ₌₀ⁿ (nCk) aⁿ⁻ᵏ bᵏ',
    explanation: 'Algebraic expansion of powers of a binomial sum.',
    variables: [
      { name: 'n', meaning: 'Non-negative integer power' },
      { name: 'k', meaning: 'Term index (0 to n)' },
      { name: 'nCk', meaning: 'Combination coefficient n! / (k!(n-k)!)' },
    ],
  },
  {
    id: 'alg-log',
    category: 'Algebra',
    title: 'Logarithm Change of Base',
    expression: 'log_b(a) = ln(a) / ln(b) = log₁₀(a) / log₁₀(b)',
    explanation: 'Allows calculating arbitrary-base logarithms using natural or base-10 logarithms.',
    variables: [
      { name: 'a', meaning: 'Positive argument (a > 0)' },
      { name: 'b', meaning: 'Base (b > 0, b ≠ 1)' },
    ],
  },

  // Trigonometry
  {
    id: 'trig-pyth',
    category: 'Trigonometry',
    title: 'Pythagorean Trigonometric Identity',
    expression: 'sin²(θ) + cos²(θ) = 1',
    explanation: 'Fundamental identity derived from the Pythagorean theorem on the unit circle.',
    variables: [{ name: 'θ', meaning: 'Angle in radians or degrees' }],
  },
  {
    id: 'trig-double-sin',
    category: 'Trigonometry',
    title: 'Sine Double Angle Formula',
    expression: 'sin(2θ) = 2 sin(θ) cos(θ)',
    explanation: 'Expresses sine of double angle in terms of single-angle trig functions.',
    variables: [{ name: 'θ', meaning: 'Angle' }],
  },
  {
    id: 'trig-cos-rule',
    category: 'Trigonometry',
    title: 'Law of Cosines',
    expression: 'c² = a² + b² - 2ab cos(C)',
    explanation: 'Relates sides of any oblique triangle to the cosine of one of its angles.',
    variables: [
      { name: 'a, b, c', meaning: 'Lengths of triangle sides' },
      { name: 'C', meaning: 'Angle opposite to side c' },
    ],
  },
  {
    id: 'trig-sin-rule',
    category: 'Trigonometry',
    title: 'Law of Sines',
    expression: 'a / sin(A) = b / sin(B) = c / sin(C) = 2R',
    explanation: 'Relates triangle sides to the sines of opposite angles and circumradius R.',
    variables: [
      { name: 'A, B, C', meaning: 'Internal angles' },
      { name: 'R', meaning: 'Circumscribed circle radius' },
    ],
  },

  // Calculus - Differentiation
  {
    id: 'calc-power-rule',
    category: 'Differentiation',
    title: 'Power Rule',
    expression: 'd/dx (xⁿ) = n · xⁿ⁻¹',
    explanation: 'Calculates the derivative of variable x raised to real power n.',
    variables: [{ name: 'n', meaning: 'Real exponent' }],
  },
  {
    id: 'calc-chain-rule',
    category: 'Differentiation',
    title: 'Chain Rule',
    expression: 'd/dx [f(g(x))] = f\'(g(x)) · g\'(x)',
    explanation: 'Differentiates composite functions by multiplying outer derivative by inner derivative.',
    variables: [
      { name: 'f', meaning: 'Outer function' },
      { name: 'g', meaning: 'Inner function' },
    ],
  },
  {
    id: 'calc-product-rule',
    category: 'Differentiation',
    title: 'Product Rule',
    expression: 'd/dx [u · v] = u\'v + uv\'',
    explanation: 'Derivative of the product of two differentiable functions.',
    variables: [{ name: 'u, v', meaning: 'Differentiable functions of x' }],
  },
  {
    id: 'calc-quotient-rule',
    category: 'Differentiation',
    title: 'Quotient Rule',
    expression: 'd/dx [u / v] = (u\'v - uv\') / v²',
    explanation: 'Derivative of the ratio of two differentiable functions where v(x) ≠ 0.',
    variables: [{ name: 'u, v', meaning: 'Differentiable functions' }],
  },

  // Calculus - Integration
  {
    id: 'calc-parts',
    category: 'Integration',
    title: 'Integration by Parts',
    expression: '∫ u dv = u·v - ∫ v du',
    explanation: 'Rule for integrating the product of two functions derived from product rule.',
    variables: [{ name: 'u, v', meaning: 'Functions selected for differentiation and integration' }],
  },
  {
    id: 'calc-power-int',
    category: 'Integration',
    title: 'Power Rule for Integration',
    expression: '∫ xⁿ dx = (xⁿ⁺¹) / (n + 1) + C  (for n ≠ -1)',
    explanation: 'Calculates the indefinite integral for power functions.',
    variables: [
      { name: 'n', meaning: 'Real power ≠ -1' },
      { name: 'C', meaning: 'Arbitrary constant of integration' },
    ],
  },
  {
    id: 'calc-gauss-int',
    category: 'Integration',
    title: 'Gaussian Integral',
    expression: '∫₋_∞⁺_∞ e^(-x²) dx = √π',
    explanation: 'Special definite integral over the entire real line, cornerstone of normal distributions.',
    variables: [{ name: 'x', meaning: 'Integration variable' }],
  },

  // Coordinate Geometry
  {
    id: 'geom-dist',
    category: 'Coordinate Geometry',
    title: 'Distance Formula in 2D',
    expression: 'd = √((x₂ - x₁)² + (y₂ - y₁)²)',
    explanation: 'Euclidean distance between two Cartesian points (x₁, y₁) and (x₂, y₂).',
    variables: [{ name: 'x₁, y₁, x₂, y₂', meaning: 'Cartesian coordinates' }],
  },
  {
    id: 'geom-circle',
    category: 'Coordinate Geometry',
    title: 'Standard Equation of a Circle',
    expression: '(x - h)² + (y - k)² = r²',
    explanation: 'Defines a circle with center (h, k) and radius r in the Cartesian plane.',
    variables: [
      { name: 'h, k', meaning: 'Center coordinates' },
      { name: 'r', meaning: 'Circle radius' },
    ],
  },

  // Vectors & Matrices
  {
    id: 'vec-dot',
    category: 'Vectors & Matrices',
    title: 'Vector Dot Product',
    expression: 'A · B = |A| |B| cos(θ) = A_x B_x + A_y B_y + A_z B_z',
    explanation: 'Scalar product measuring how aligned two vectors are.',
    variables: [
      { name: 'A, B', meaning: '3D vectors' },
      { name: 'θ', meaning: 'Angle between vectors' },
    ],
  },
  {
    id: 'vec-cross',
    category: 'Vectors & Matrices',
    title: 'Vector Cross Product',
    expression: '|A × B| = |A| |B| sin(θ) n̂',
    explanation: 'Vector product yielding a vector perpendicular to both input vectors.',
    variables: [
      { name: 'n̂', meaning: 'Unit normal vector via right-hand rule' },
    ],
  },

  // Statistics & Probability
  {
    id: 'stat-normal',
    category: 'Probability & Statistics',
    title: 'Gaussian (Normal) Probability Density Function',
    expression: 'f(x) = (1 / (σ √(2π))) · e^(-0.5 ((x - μ) / σ)²)',
    explanation: 'Bell-curve probability distribution characterized by mean μ and standard deviation σ.',
    variables: [
      { name: 'μ', meaning: 'Distribution mean' },
      { name: 'σ', meaning: 'Standard deviation' },
    ],
  },
  {
    id: 'stat-bayes',
    category: 'Probability & Statistics',
    title: 'Bayes\' Theorem',
    expression: 'P(A | B) = [P(B | A) · P(A)] / P(B)',
    explanation: 'Describes probability of event A given prior knowledge of conditions related to event B.',
    variables: [
      { name: 'P(A|B)', meaning: 'Posterior probability' },
      { name: 'P(A)', meaning: 'Prior probability' },
      { name: 'P(B|A)', meaning: 'Likelihood' },
    ],
  },

  // Physics - Mechanics
  {
    id: 'phys-newton2',
    category: 'Mechanics',
    title: 'Newton\'s Second Law of Motion',
    expression: 'F = m · a = dp / dt',
    explanation: 'Net force applied to a body equals its mass multiplied by acceleration.',
    variables: [
      { name: 'F', meaning: 'Net force', unit: 'N' },
      { name: 'm', meaning: 'Inertial mass', unit: 'kg' },
      { name: 'a', meaning: 'Acceleration', unit: 'm/s²' },
    ],
  },
  {
    id: 'phys-ke',
    category: 'Mechanics',
    title: 'Kinetic Energy',
    expression: 'E_k = (1/2) · m · v²',
    explanation: 'Classical mechanical kinetic energy of an object of mass m traveling at speed v.',
    variables: [
      { name: 'm', meaning: 'Mass', unit: 'kg' },
      { name: 'v', meaning: 'Velocity', unit: 'm/s' },
    ],
  },

  // Physics - Electromagnetism
  {
    id: 'phys-coulomb',
    category: 'Electricity & Magnetism',
    title: 'Coulomb\'s Law of Electrostatic Force',
    expression: 'F = (1 / (4πε₀)) · (|q₁ q₂| / r²)',
    explanation: 'Electrostatic force between two stationary electric charges separated by distance r.',
    variables: [
      { name: 'q₁, q₂', meaning: 'Electric charges', unit: 'C' },
      { name: 'r', meaning: 'Distance between charges', unit: 'm' },
      { name: 'ε₀', meaning: 'Vacuum permittivity', unit: 'F/m' },
    ],
  },
  {
    id: 'phys-ohm',
    category: 'Electricity & Magnetism',
    title: 'Ohm\'s Law',
    expression: 'V = I · R',
    explanation: 'Potential difference across an electrical conductor is proportional to current.',
    variables: [
      { name: 'V', meaning: 'Electric potential / voltage', unit: 'V' },
      { name: 'I', meaning: 'Electric current', unit: 'A' },
      { name: 'R', meaning: 'Resistance', unit: 'Ω' },
    ],
  },

  // Modern Physics & Relativity
  {
    id: 'phys-mass-energy',
    category: 'Modern Physics',
    title: 'Mass-Energy Equivalence',
    expression: 'E = m · c²',
    explanation: 'Einstein\'s principle that mass and energy are directly interconvertible.',
    variables: [
      { name: 'E', meaning: 'Equivalent energy', unit: 'J' },
      { name: 'm', meaning: 'Relativistic or rest mass', unit: 'kg' },
      { name: 'c', meaning: 'Speed of light in vacuum', unit: 'm/s' },
    ],
  },
  {
    id: 'phys-photoelectric',
    category: 'Modern Physics',
    title: 'Einstein\'s Photoelectric Equation',
    expression: 'E = h · f = Φ + K_max',
    explanation: 'Energy of an incident photon equals work function Φ plus maximum kinetic energy of ejected electron.',
    variables: [
      { name: 'h', meaning: 'Planck constant', unit: 'J·s' },
      { name: 'f', meaning: 'Light frequency', unit: 'Hz' },
      { name: 'Φ', meaning: 'Work function of material', unit: 'J' },
      { name: 'K_max', meaning: 'Maximum electron kinetic energy', unit: 'J' },
    ],
  },
];
