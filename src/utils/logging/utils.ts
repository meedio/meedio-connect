const MAX_DEPTH = 10;

const handleSpecialTypes = (value: unknown): unknown => {
  if (value === undefined) return 'undefined';
  if (typeof value === 'function') return `[Function${value.name ? `: ${value.name}` : ''}]`;
  if (typeof value === 'symbol') return value.toString();
  if (typeof value === 'bigint') return `${value}n`;
  if (value instanceof Date) return value.toISOString();
  return value;
};

const safeStringify = (obj: unknown, space?: string | number): string => {
  const processedObj = handleSpecialTypes(obj);
  if (processedObj !== obj) return String(processedObj);
  if (obj === null) return 'null';

  const seen = new WeakSet();

  const replacer = (key: string, value: unknown, depth = 0, path: string[] = []): unknown => {
    const processed = handleSpecialTypes(value);
    if (processed !== value) return processed;

    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);

      const currentPath = path.concat(key).filter(Boolean);

      // Skip known heavy properties (reference: https://github.com/meedio/meedio/pull/6175)
      if (['transformer', 'canvas'].includes(key)) return `[Skipped ${key}]`;

      if (depth >= MAX_DEPTH) {
        console.error(
          '[safeStringify] Depth limit reached at:',
          currentPath.join('.'),
          'Preview:',
          Array.isArray(value) ? `[Array length: ${value.length}]` : Object.keys(value).slice(0, 5)
        );

        return '[Truncated depth]';
      }

      if (value instanceof Map) return { __type: 'Map', value: Array.from(value.entries()) };
      if (value instanceof Set) return { __type: 'Set', value: Array.from(value) };

      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replacer(k, v, depth + 1, currentPath)]));
    }

    return value;
  };

  try {
    return JSON.stringify(replacer('', obj, 0, []), null, space)
      .replace(/"__type":"Map","value":/g, '[Map: ')
      .replace(/"__type":"Set","value":/g, '[Set: ')
      .replace(/}\]/g, '}]');
  } catch (e) {
    return `[Unserializable: ${e}]`;
  }
};

export const logArgsSerializer = (args: unknown[]): string =>
  args
    .map((arg) => {
      if (arg instanceof Error) {
        return JSON.stringify({ __type: 'Error', name: arg.name, message: arg.message, stack: arg.stack });
      }

      return safeStringify(arg);
    })
    .join(' ');
