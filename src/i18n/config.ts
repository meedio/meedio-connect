import i18n from 'i18next';
import HttpApi, { HttpBackendOptions } from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from './LanguageDetector/LanguageDetector';
import { TRANSLATIONS_VERSION } from './translationsVersion';
import { buildYupLocale } from './utils';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init<HttpBackendOptions>(
    {
      backend: { queryStringParams: { v: TRANSLATIONS_VERSION } },
      fallbackLng: false,
      keySeparator: '.',
      interpolation: {
        escapeValue: false,
      },
      react: { bindI18n: 'languageChanged loaded' },
    },
    buildYupLocale
  );

export default i18n;
