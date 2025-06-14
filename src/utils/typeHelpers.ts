
// Utility functions to safely handle string/number types
export function safeStringReplace(value: string | number, search: string | RegExp, replace: string): string {
  if (typeof value === 'string') {
    return value.replace(search, replace);
  }
  return value.toString().replace(search, replace);
}

export function safeStringStartsWith(value: string | number, searchString: string): boolean {
  if (typeof value === 'string') {
    return value.startsWith(searchString);
  }
  return value.toString().startsWith(searchString);
}

export function parseNumericValue(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }
  return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
}

export function formatCurrency(amount: string | number): string {
  const numericValue = parseNumericValue(amount);
  return `$${numericValue.toFixed(2)}`;
}
