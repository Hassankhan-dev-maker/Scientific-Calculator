/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  toBase: (val: number) => number;
  fromBase: (baseVal: number) => number;
}

export interface UnitCategory {
  id: string;
  name: string;
  iconName: string;
  baseUnit: string;
  units: UnitDefinition[];
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length',
    iconName: 'Ruler',
    baseUnit: 'm',
    units: [
      { id: 'm', name: 'Meter', symbol: 'm', toBase: v => v, fromBase: v => v },
      { id: 'km', name: 'Kilometer', symbol: 'km', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', toBase: v => v * 0.01, fromBase: v => v / 0.01 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', toBase: v => v * 0.001, fromBase: v => v / 0.001 },
      { id: 'um', name: 'Micrometer (Micron)', symbol: 'µm', toBase: v => v * 1e-6, fromBase: v => v * 1e6 },
      { id: 'nm', name: 'Nanometer', symbol: 'nm', toBase: v => v * 1e-9, fromBase: v => v * 1e9 },
      { id: 'in', name: 'Inch', symbol: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      { id: 'ft', name: 'Foot', symbol: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { id: 'yd', name: 'Yard', symbol: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { id: 'mi', name: 'Mile', symbol: 'mi', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      { id: 'nmi', name: 'Nautical Mile', symbol: 'NM', toBase: v => v * 1852, fromBase: v => v / 1852 },
      { id: 'ly', name: 'Light Year', symbol: 'ly', toBase: v => v * 9.4607304725808e15, fromBase: v => v / 9.4607304725808e15 },
      { id: 'pc', name: 'Parsec', symbol: 'pc', toBase: v => v * 3.08567758149137e16, fromBase: v => v / 3.08567758149137e16 },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    iconName: 'Maximize2',
    baseUnit: 'm²',
    units: [
      { id: 'm2', name: 'Square Meter', symbol: 'm²', toBase: v => v, fromBase: v => v },
      { id: 'km2', name: 'Square Kilometer', symbol: 'km²', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      { id: 'cm2', name: 'Square Centimeter', symbol: 'cm²', toBase: v => v * 1e-4, fromBase: v => v / 1e-4 },
      { id: 'mm2', name: 'Square Millimeter', symbol: 'mm²', toBase: v => v * 1e-6, fromBase: v => v / 1e-6 },
      { id: 'ha', name: 'Hectare', symbol: 'ha', toBase: v => v * 10000, fromBase: v => v / 10000 },
      { id: 'acre', name: 'Acre', symbol: 'ac', toBase: v => v * 4046.8564224, fromBase: v => v / 4046.8564224 },
      { id: 'sqft', name: 'Square Foot', symbol: 'ft²', toBase: v => v * 0.09290304, fromBase: v => v / 0.09290304 },
      { id: 'sqin', name: 'Square Inch', symbol: 'in²', toBase: v => v * 0.00064516, fromBase: v => v / 0.00064516 },
      { id: 'sqmi', name: 'Square Mile', symbol: 'mi²', toBase: v => v * 2589988.110336, fromBase: v => v / 2589988.110336 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    iconName: 'Box',
    baseUnit: 'L',
    units: [
      { id: 'l', name: 'Liter', symbol: 'L', toBase: v => v, fromBase: v => v },
      { id: 'ml', name: 'Milliliter', symbol: 'mL', toBase: v => v * 0.001, fromBase: v => v / 0.001 },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'cm3', name: 'Cubic Centimeter (cc)', symbol: 'cm³', toBase: v => v * 0.001, fromBase: v => v / 0.001 },
      { id: 'gal_us', name: 'Gallon (US)', symbol: 'gal', toBase: v => v * 3.785411784, fromBase: v => v / 3.785411784 },
      { id: 'gal_uk', name: 'Gallon (UK/Imperial)', symbol: 'gal (imp)', toBase: v => v * 4.54609, fromBase: v => v / 4.54609 },
      { id: 'qt', name: 'Quart (US)', symbol: 'qt', toBase: v => v * 0.946352946, fromBase: v => v / 0.946352946 },
      { id: 'pt', name: 'Pint (US)', symbol: 'pt', toBase: v => v * 0.473176473, fromBase: v => v / 0.473176473 },
      { id: 'cup', name: 'Cup (US)', symbol: 'cup', toBase: v => v * 0.2365882365, fromBase: v => v / 0.2365882365 },
      { id: 'floz', name: 'Fluid Ounce (US)', symbol: 'fl oz', toBase: v => v * 0.0295735295625, fromBase: v => v / 0.0295735295625 },
      { id: 'cuft', name: 'Cubic Foot', symbol: 'ft³', toBase: v => v * 28.316846592, fromBase: v => v / 28.316846592 },
    ],
  },
  {
    id: 'mass',
    name: 'Mass & Weight',
    iconName: 'Scale',
    baseUnit: 'kg',
    units: [
      { id: 'kg', name: 'Kilogram', symbol: 'kg', toBase: v => v, fromBase: v => v },
      { id: 'g', name: 'Gram', symbol: 'g', toBase: v => v * 0.001, fromBase: v => v / 0.001 },
      { id: 'mg', name: 'Milligram', symbol: 'mg', toBase: v => v * 1e-6, fromBase: v => v * 1e6 },
      { id: 'ug', name: 'Microgram', symbol: 'µg', toBase: v => v * 1e-9, fromBase: v => v * 1e9 },
      { id: 'ton_metric', name: 'Metric Ton (Tonne)', symbol: 't', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'lb', name: 'Pound', symbol: 'lb', toBase: v => v * 0.45359237, fromBase: v => v / 0.45359237 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', toBase: v => v * 0.028349523125, fromBase: v => v / 0.028349523125 },
      { id: 'st', name: 'Stone', symbol: 'st', toBase: v => v * 6.35029318, fromBase: v => v / 6.35029318 },
      { id: 'carat', name: 'Carat (Metric)', symbol: 'ct', toBase: v => v * 0.0002, fromBase: v => v / 0.0002 },
      { id: 'u', name: 'Atomic Mass Unit', symbol: 'Da (u)', toBase: v => v * 1.6605390666e-27, fromBase: v => v / 1.6605390666e-27 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    iconName: 'Thermometer',
    baseUnit: 'C',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', toBase: v => v, fromBase: v => v },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: v => (v - 32) * (5 / 9), fromBase: v => v * (9 / 5) + 32 },
      { id: 'k', name: 'Kelvin', symbol: 'K', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
      { id: 'r', name: 'Rankine', symbol: '°R', toBase: v => (v - 491.67) * (5 / 9), fromBase: v => (v + 273.15) * (9 / 5) },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    iconName: 'Gauge',
    baseUnit: 'm/s',
    units: [
      { id: 'mps', name: 'Meters per second', symbol: 'm/s', toBase: v => v, fromBase: v => v },
      { id: 'kmh', name: 'Kilometers per hour', symbol: 'km/h', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      { id: 'mph', name: 'Miles per hour', symbol: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { id: 'knot', name: 'Knot', symbol: 'kn', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
      { id: 'fps', name: 'Feet per second', symbol: 'ft/s', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { id: 'mach', name: 'Mach (at STP air)', symbol: 'M', toBase: v => v * 340.29, fromBase: v => v / 340.29 },
    ],
  },
  {
    id: 'pressure',
    name: 'Pressure',
    iconName: 'Activity',
    baseUnit: 'Pa',
    units: [
      { id: 'pa', name: 'Pascal', symbol: 'Pa', toBase: v => v, fromBase: v => v },
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'bar', name: 'Bar', symbol: 'bar', toBase: v => v * 100000, fromBase: v => v / 100000 },
      { id: 'psi', name: 'Pound per sq inch', symbol: 'psi', toBase: v => v * 6894.757293, fromBase: v => v / 6894.757293 },
      { id: 'atm', name: 'Standard Atmosphere', symbol: 'atm', toBase: v => v * 101325, fromBase: v => v / 101325 },
      { id: 'torr', name: 'Torr / mmHg', symbol: 'mmHg', toBase: v => v * 133.322368, fromBase: v => v / 133.322368 },
    ],
  },
  {
    id: 'energy',
    name: 'Energy & Work',
    iconName: 'Zap',
    baseUnit: 'J',
    units: [
      { id: 'j', name: 'Joule', symbol: 'J', toBase: v => v, fromBase: v => v },
      { id: 'kj', name: 'Kilojoule', symbol: 'kJ', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'cal', name: 'Calorie (Thermochemical)', symbol: 'cal', toBase: v => v * 4.184, fromBase: v => v / 4.184 },
      { id: 'kcal', name: 'Kilocalorie (Food cal)', symbol: 'kcal', toBase: v => v * 4184, fromBase: v => v / 4184 },
      { id: 'wh', name: 'Watt-hour', symbol: 'Wh', toBase: v => v * 3600, fromBase: v => v / 3600 },
      { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh', toBase: v => v * 3.6e6, fromBase: v => v / 3.6e6 },
      { id: 'ev', name: 'Electronvolt', symbol: 'eV', toBase: v => v * 1.602176634e-19, fromBase: v => v / 1.602176634e-19 },
      { id: 'btu', name: 'British Thermal Unit (BTU)', symbol: 'BTU', toBase: v => v * 1055.05585, fromBase: v => v / 1055.05585 },
    ],
  },
  {
    id: 'power',
    name: 'Power',
    iconName: 'Flame',
    baseUnit: 'W',
    units: [
      { id: 'w', name: 'Watt', symbol: 'W', toBase: v => v, fromBase: v => v },
      { id: 'kw', name: 'Kilowatt', symbol: 'kW', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'mw', name: 'Megawatt', symbol: 'MW', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      { id: 'hp', name: 'Mechanical Horsepower', symbol: 'hp', toBase: v => v * 745.699872, fromBase: v => v / 745.699872 },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    iconName: 'Clock',
    baseUnit: 's',
    units: [
      { id: 'ns', name: 'Nanosecond', symbol: 'ns', toBase: v => v * 1e-9, fromBase: v => v * 1e9 },
      { id: 'us', name: 'Microsecond', symbol: 'µs', toBase: v => v * 1e-6, fromBase: v => v * 1e6 },
      { id: 'ms', name: 'Millisecond', symbol: 'ms', toBase: v => v * 0.001, fromBase: v => v / 0.001 },
      { id: 's', name: 'Second', symbol: 's', toBase: v => v, fromBase: v => v },
      { id: 'min', name: 'Minute', symbol: 'min', toBase: v => v * 60, fromBase: v => v / 60 },
      { id: 'h', name: 'Hour', symbol: 'h', toBase: v => v * 3600, fromBase: v => v / 3600 },
      { id: 'day', name: 'Day', symbol: 'd', toBase: v => v * 86400, fromBase: v => v / 86400 },
      { id: 'week', name: 'Week', symbol: 'wk', toBase: v => v * 604800, fromBase: v => v / 604800 },
      { id: 'year', name: 'Year (Julian 365.25d)', symbol: 'yr', toBase: v => v * 31557600, fromBase: v => v / 31557600 },
    ],
  },
  {
    id: 'data',
    name: 'Data Storage',
    iconName: 'HardDrive',
    baseUnit: 'byte',
    units: [
      { id: 'bit', name: 'Bit', symbol: 'bit', toBase: v => v / 8, fromBase: v => v * 8 },
      { id: 'byte', name: 'Byte', symbol: 'B', toBase: v => v, fromBase: v => v },
      { id: 'kb', name: 'Kilobyte (Decimal)', symbol: 'KB', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'kib', name: 'Kibibyte (Binary)', symbol: 'KiB', toBase: v => v * 1024, fromBase: v => v / 1024 },
      { id: 'mb', name: 'Megabyte (Decimal)', symbol: 'MB', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      { id: 'mib', name: 'Mebibyte (Binary)', symbol: 'MiB', toBase: v => v * 1048576, fromBase: v => v / 1048576 },
      { id: 'gb', name: 'Gigabyte (Decimal)', symbol: 'GB', toBase: v => v * 1e9, fromBase: v => v / 1e9 },
      { id: 'gib', name: 'Gibibyte (Binary)', symbol: 'GiB', toBase: v => v * 1073741824, fromBase: v => v / 1073741824 },
      { id: 'tb', name: 'Terabyte (Decimal)', symbol: 'TB', toBase: v => v * 1e12, fromBase: v => v / 1e12 },
      { id: 'tib', name: 'Tebibyte (Binary)', symbol: 'TiB', toBase: v => v * 1099511627776, fromBase: v => v / 1099511627776 },
    ],
  },
  {
    id: 'angle',
    name: 'Angle',
    iconName: 'Compass',
    baseUnit: 'deg',
    units: [
      { id: 'deg', name: 'Degree', symbol: '°', toBase: v => v, fromBase: v => v },
      { id: 'rad', name: 'Radian', symbol: 'rad', toBase: v => (v * 180) / Math.PI, fromBase: v => (v * Math.PI) / 180 },
      { id: 'grad', name: 'Gradian', symbol: 'gon', toBase: v => (v * 180) / 200, fromBase: v => (v * 200) / 180 },
      { id: 'arcmin', name: 'Arcminute', symbol: 'arcmin', toBase: v => v / 60, fromBase: v => v * 60 },
      { id: 'arcsec', name: 'Arcsecond', symbol: 'arcsec', toBase: v => v / 3600, fromBase: v => v * 3600 },
      { id: 'rev', name: 'Revolution (Circle)', symbol: 'rev', toBase: v => v * 360, fromBase: v => v / 360 },
    ],
  },
  {
    id: 'frequency',
    name: 'Frequency',
    iconName: 'Radio',
    baseUnit: 'Hz',
    units: [
      { id: 'hz', name: 'Hertz', symbol: 'Hz', toBase: v => v, fromBase: v => v },
      { id: 'khz', name: 'Kilohertz', symbol: 'kHz', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'mhz', name: 'Megahertz', symbol: 'MHz', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      { id: 'ghz', name: 'Gigahertz', symbol: 'GHz', toBase: v => v * 1e9, fromBase: v => v / 1e9 },
      { id: 'rpm', name: 'Revolutions per min', symbol: 'RPM', toBase: v => v / 60, fromBase: v => v * 60 },
    ],
  },
  {
    id: 'force',
    name: 'Force',
    iconName: 'Shield',
    baseUnit: 'N',
    units: [
      { id: 'n', name: 'Newton', symbol: 'N', toBase: v => v, fromBase: v => v },
      { id: 'kn', name: 'Kilonewton', symbol: 'kN', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'lbf', name: 'Pound-force', symbol: 'lbf', toBase: v => v * 4.448221615, fromBase: v => v / 4.448221615 },
      { id: 'kgf', name: 'Kilogram-force', symbol: 'kgf', toBase: v => v * 9.80665, fromBase: v => v / 9.80665 },
      { id: 'dyn', name: 'Dyne', symbol: 'dyn', toBase: v => v * 1e-5, fromBase: v => v * 1e5 },
    ],
  },
  {
    id: 'fuel',
    name: 'Fuel Economy',
    iconName: 'Droplet',
    baseUnit: 'km_per_l',
    units: [
      { id: 'kml', name: 'Kilometer per Liter', symbol: 'km/L', toBase: v => v, fromBase: v => v },
      { id: 'mpgus', name: 'Miles per Gallon (US)', symbol: 'mpg (US)', toBase: v => v * 0.425143707, fromBase: v => v / 0.425143707 },
      { id: 'mpguk', name: 'Miles per Gallon (UK)', symbol: 'mpg (UK)', toBase: v => v * 0.35400619, fromBase: v => v / 0.35400619 },
      { id: 'l100km', name: 'Liters per 100km', symbol: 'L/100km', toBase: v => (v === 0 ? 0 : 100 / v), fromBase: v => (v === 0 ? 0 : 100 / v) },
    ],
  },
];

export function convertUnits(
  val: number,
  categoryId: string,
  fromUnitId: string,
  toUnitId: string
): { result: number; formula: string } | null {
  const category = UNIT_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return null;

  const fromUnit = category.units.find(u => u.id === fromUnitId);
  const toUnit = category.units.find(u => u.id === toUnitId);
  if (!fromUnit || !toUnit) return null;

  const baseVal = fromUnit.toBase(val);
  const result = toUnit.fromBase(baseVal);

  const formula = `${val} ${fromUnit.symbol} = ${Number(result.toPrecision(7))} ${toUnit.symbol}`;
  return { result, formula };
}
