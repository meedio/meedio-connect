import { Placement } from '@floating-ui/react-dom-interactions';
import DropdownButton from '@shared/components/DropdownButton/DropdownButton';
import { defaultHoverTransition } from '@shared/utils';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ReactComponent as ArrowDown } from 'assets/icons/ArrowDown.svg';
import { ReactComponent as DaFlag } from 'assets/icons/DaFlag.svg';
import { ReactComponent as DeFlag } from 'assets/icons/DeFlag.svg';
import { ReactComponent as GbFlag } from 'assets/icons/GbFlag.svg';
import { ReactComponent as ItFlag } from 'assets/icons/ItFlag.svg';
import { ReactComponent as LtFlag } from 'assets/icons/LtFlag.svg';
import i18n from 'i18n/config';
import { IconType } from 'utils/types';

import { useLanguageOptions } from './useLanguageOptions';

type LanguageIcons = Record<string, IconType>;

interface LanguageSelectProps {
  isContrast?: boolean;
  dropdownPlacement?: Placement;
  className?: string;
  flagNeeded?: boolean;
}

export const languageIcons: LanguageIcons = {
  da: DaFlag,
  de: DeFlag,
  en: GbFlag,
  lt: LtFlag,
  it: ItFlag,
};

const LanguageSelect = ({
  isContrast = false,
  dropdownPlacement,
  className,
  flagNeeded = false,
}: LanguageSelectProps) => {
  const { t } = useTranslation();
  const { options, currentLanguage } = useLanguageOptions();

  const language = i18n.language;
  const Icon = languageIcons[language];

  return (
    <DropdownButton
      className="z-dropdown min-w-[180px] bg-white capitalize"
      options={options}
      placement={dropdownPlacement}
      fallbackStrategy="bestFit"
      aria-label={t('select_language')}
      title={t('current_language', { currentLanguage })}
    >
      {({ open }) => {
        const contrastStyle = open ? 'text-white bg-white10' : 'text-white60 hover:text-white90';
        const lightStyle = open ? 'text-black bg-gray-20' : 'text-gray-60 hover:text-black';
        const style = isContrast ? contrastStyle : lightStyle;

        return (
          <div
            className={cx(
              'flex h-10 w-full items-center space-x-2 rounded-xl px-3 md:h-12',
              style,
              defaultHoverTransition,
              className
            )}
          >
            {flagNeeded && <Icon />}
            <span className="text-size-sm truncate text-left capitalize">{currentLanguage}</span>
            <ArrowDown className={cx('stroke-1.5 stroke-current', { 'rotate-180': open })} />
          </div>
        );
      }}
    </DropdownButton>
  );
};

export default LanguageSelect;
