/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WordSize = 8 | 16 | 32 | 64;
export type NumberBase = 'HEX' | 'DEC' | 'OCT' | 'BIN';

export interface ProgrammerState {
  value: bigint;
  wordSize: WordSize;
  isSigned: boolean;
  base: NumberBase;
}

/**
 * Get mask for current word size
 */
export function getMask(size: WordSize): bigint {
  if (size === 8) return 0xFFn;
  if (size === 16) return 0xFFFFn;
  if (size === 32) return 0xFFFFFFFFn;
  return 0xFFFFFFFFFFFFFFFFn;
}

/**
 * Clamp a BigInt to word size (unsigned representation)
 */
export function clampToWordSize(val: bigint, size: WordSize): bigint {
  const mask = getMask(size);
  return val & mask;
}

/**
 * Convert BigInt to signed value based on word size
 */
export function toSigned(val: bigint, size: WordSize): bigint {
  const unsigned = clampToWordSize(val, size);
  const signBit = 1n << BigInt(size - 1);
  if ((unsigned & signBit) !== 0n) {
    return unsigned - (1n << BigInt(size));
  }
  return unsigned;
}

/**
 * Format BigInt into all 4 number bases
 */
export function formatAllBases(val: bigint, size: WordSize, isSigned: boolean) {
  const unsigned = clampToWordSize(val, size);
  const signed = toSigned(unsigned, size);

  // Hexadecimal
  const hex = unsigned.toString(16).toUpperCase();
  // Binary padded with grouping of 4
  let bin = unsigned.toString(2).padStart(size, '0');
  // Group into bytes or 4-bit nibbles
  const binChunks: string[] = [];
  for (let i = 0; i < bin.length; i += 4) {
    binChunks.push(bin.slice(i, i + 4));
  }
  const binFormatted = binChunks.join(' ');

  // Octal
  const oct = unsigned.toString(8);

  // Decimal
  const dec = isSigned ? signed.toString(10) : unsigned.toString(10);

  return {
    hex: '0x' + hex,
    hexRaw: hex,
    dec,
    oct: '0o' + oct,
    octRaw: oct,
    bin: binFormatted,
    binRaw: bin,
    rawBigInt: unsigned,
    signedBigInt: signed,
  };
}

/**
 * Parse string according to base and word size
 */
export function parseByBase(input: string, base: NumberBase, size: WordSize): bigint {
  const clean = input.replace(/\s+/g, '').replace(/^0x|^0o|^0b/i, '');
  if (!clean) return 0n;

  let val: bigint;
  try {
    if (base === 'HEX') {
      val = BigInt('0x' + clean);
    } else if (base === 'DEC') {
      val = BigInt(clean);
    } else if (base === 'OCT') {
      val = BigInt('0o' + clean);
    } else {
      val = BigInt('0b' + clean);
    }
  } catch {
    return 0n;
  }
  return clampToWordSize(val, size);
}

/**
 * Bitwise operations
 */
export function bitwiseOp(
  op: 'AND' | 'OR' | 'XOR' | 'NOT' | 'NAND' | 'NOR' | 'XNOR' | 'LSH' | 'RSH' | 'ASR' | 'ROL' | 'ROR',
  a: bigint,
  b: bigint,
  size: WordSize
): bigint {
  const mask = getMask(size);
  const ua = a & mask;
  const ub = b & mask;

  switch (op) {
    case 'AND':
      return ua & ub;
    case 'OR':
      return ua | ub;
    case 'XOR':
      return ua ^ ub;
    case 'NOT':
      return (~ua) & mask;
    case 'NAND':
      return (~(ua & ub)) & mask;
    case 'NOR':
      return (~(ua | ub)) & mask;
    case 'XNOR':
      return (~(ua ^ ub)) & mask;
    case 'LSH': {
      const shift = Number(ub % BigInt(size));
      return (ua << BigInt(shift)) & mask;
    }
    case 'RSH': {
      const shift = Number(ub % BigInt(size));
      return (ua >> BigInt(shift)) & mask;
    }
    case 'ASR': {
      // Arithmetic shift preserves sign bit
      const signedA = toSigned(ua, size);
      const shift = Number(ub % BigInt(size));
      const res = signedA >> BigInt(shift);
      return clampToWordSize(res, size);
    }
    case 'ROL': {
      const shift = Number(ub % BigInt(size));
      return ((ua << BigInt(shift)) | (ua >> BigInt(size - shift))) & mask;
    }
    case 'ROR': {
      const shift = Number(ub % BigInt(size));
      return ((ua >> BigInt(shift)) | (ua << BigInt(size - shift))) & mask;
    }
  }
}
