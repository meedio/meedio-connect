import { Plugin, TransformResult } from 'vite';
import { setLocale } from 'yup';

import { TRANSLATIONS_VERSION } from './translationsVersion';

const languageNames: Record<string, string> = {
  en: 'english',
  da: 'dansk',
  lt: 'lietuvių',
  de: 'deutsch',
  it: 'italiano',
};

export const languages = Object.keys(languageNames);
export const hasLanguage = (key: string) => languages.includes(key);

export const buildYupLocale = () =>
  setLocale({
    mixed: {
      required: ({ path }) => ({ key: 'validation.required_field', values: { field: path } }),
    },
    boolean: {
      isValue: ({ path }) => ({ key: 'validation.checkbox_error', values: { field: path } }),
    },
    string: {
      min: ({ min, path }) => ({ key: 'validation.min_error', values: { min, field: path } }),
      max: ({ max, path }) => ({ key: 'validation.max_error', values: { max, field: path } }),
      length: ({ length, path }) => ({ key: 'validation.exactly_error', values: { length, field: path } }),
      email: ({ path }) => ({ key: 'email_must_be_valid', values: { field: path } }),
      matches: ({ path }) => ({ key: 'must_match_pattern', values: { field: path } }),
    },
  });

export const getLanguageName = (languageKey: string) => languageNames[languageKey];

export const insertTranslationsVersion: () => Plugin = () => ({
  name: 'insert-translations-version-plugin',
  async transform(code: string, id: string): Promise<TransformResult | null> {
    if (id.endsWith('translationsVersion.ts')) {
      const version = Date.now();

      return {
        code: code.replace(new RegExp(`\\b${TRANSLATIONS_VERSION}\\b`, 'g'), version.toString()),
        map: null,
      };
    }

    return null;
  },
});
