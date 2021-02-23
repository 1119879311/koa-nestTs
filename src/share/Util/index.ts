
export const isString = (fn: unknown): fn is string => typeof fn === 'string';

export const isObject = (val:unknown): val is object => typeof val ==="object"&& val !==null