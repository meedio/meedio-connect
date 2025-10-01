import { parseJSON } from 'hooks/useLocalStorage/useLocalStorage';
import constants from 'utils/Constants';

const LanguageStorage = {
  get: () => {
    const language = localStorage.getItem(constants.STORAGE_LANGUAGE_KEY);
    return parseJSON<string>(language);
  },
  getLangOrDefault: () => LanguageStorage.get() || constants.DEFAULT_LANGUAGE,
  set: (language: string) => localStorage.setItem(constants.STORAGE_LANGUAGE_KEY, JSON.stringify(language)),
};

export default LanguageStorage;
