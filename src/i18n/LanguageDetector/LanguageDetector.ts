import { lt, enGB, da, de, it } from 'date-fns/locale';
import setDefaultOptions from 'date-fns/setDefaultOptions';
import { LanguageDetectorAsyncModule } from 'i18next';

import LanguageStorage from './LanguageStorage';

const DEFAULT_LANGUAGE_CODE = 'en';
const locales = {
  lt,
  en: enGB,
  da,
  de,
  it,
};

const LanguageDetector: LanguageDetectorAsyncModule = {
  async: true,
  type: 'languageDetector',
  init: () => undefined,
  detect: (callback) => {
    const lng = LanguageStorage.get();
    if (lng) return callback(lng);

    callback(DEFAULT_LANGUAGE_CODE);
  },
  cacheUserLanguage: (lng) => {
    const [code] = lng.split('-') as [keyof typeof locales, string];
    setDefaultOptions({ locale: locales[code] });
    return LanguageStorage.set(lng);
  },
};

export default LanguageDetector;
