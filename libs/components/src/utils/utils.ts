// We need this because for some reason positioning properties (top, bottom etc) in the
// same class are converted to inset in production build and
// older browser versions are not supporting inset.
export const insetZero = 'top-0 bottom-0 left-0 right-0';
export const defaultHoverTransition = 'transition duration-150 ease-in-out';

export type ParamsObject = Record<string, string>;

export const lowercaseSearchParams = (params: URLSearchParams) =>
  Array.from(params.entries()).reduce((acc, [key, value]) => {
    const lowercasedKey = key.toLowerCase();

    acc[lowercasedKey] = lowercasedKey === 'name' ? value : value.toLowerCase();

    return acc;
  }, {} as ParamsObject);
