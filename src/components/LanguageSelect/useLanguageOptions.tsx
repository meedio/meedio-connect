import { DropdownSelectionProps } from '@shared/components/DropdownButton/DropdownSelection';

import i18n from 'i18n/config';
import { getLanguageName, languages } from 'i18n/utils';

import { languageIcons } from './LanguageSelect';

export const useLanguageOptions = () => {
  const otherLanguages = languages.filter((lng) => lng !== i18n.language);
  const currentLanguage = i18n.language;

  const handleFailedLanguageChange = (currentLanguage: string) => {
    i18n.changeLanguage(currentLanguage);

    // TODO: add toasts later
    // pushToast({ variant: 'error', title: t('language_change_fail') });
  };

  const options = otherLanguages.map((language): DropdownSelectionProps => {
    const Icon = languageIcons[language];

    return {
      title: getLanguageName(language),
      icon: <Icon className="mr-2" />,
      onClick: () => {
        i18n.changeLanguage(language, (err) => {
          //NOTE: stay with the same language if problem happens during language change
          if (err) {
            handleFailedLanguageChange(currentLanguage);
          }
        });

        const languageObject = i18n.getDataByLanguage(language);

        if (languageObject && !Object.keys(languageObject.translation).length) {
          //NOTE: stay with the same language if offline
          if (!navigator.onLine) return handleFailedLanguageChange(currentLanguage);

          i18n.reloadResources();
        }
      },
    };
  });

  return { options, currentLanguage: getLanguageName(currentLanguage) };
};
