
// Utility functions for safe type operations
export const safeStringReplace = (value: string | number, searchValue: string | RegExp, replaceValue: string): string => {
  return String(value).replace(searchValue, replaceValue);
};

export const safeStringStartsWith = (value: string | number, searchString: string): boolean => {
  return String(value).startsWith(searchString);
};

export const safeNumberParse = (value: string | number): number => {
  if (typeof value === 'number') return value;
  return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
};
