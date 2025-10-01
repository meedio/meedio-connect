import { ButtonVariant } from '@shared/components/Button/Button';
import { CheckboxVariant } from '@shared/components/Checkbox/Checkbox';
import { HeaderVariant } from '@shared/components/Header/Header';
import { RoundedContainerVariant } from '@shared/components/RoundedContainer/RoundedContainer';
import { TooltipVariant } from '@shared/components/Tooltip/Tooltip';

import { HeaderLogoVariant } from 'components/HeaderLogo/HeaderLogo';
import { SpinnerVariantType } from 'components/Spinner/Spinner';
import { TimerVariantType } from 'components/Timer/Timer';

type ThemeVariants = [
  headerVariant: HeaderVariant,
  headerLogoVariant: HeaderLogoVariant,
  preRoomBackButtonVariant: ButtonVariant,
  timerVariant: TimerVariantType,
  joinButtonVariant: ButtonVariant,
  shareRoomButtonVariant: ButtonVariant,
  tooltipVariant: TooltipVariant,
  checkboxVariant: CheckboxVariant,
  controlButtonVariant: ButtonVariant,
  spinnerVariant: SpinnerVariantType,
  roundedContainerVariant: RoundedContainerVariant,
];

const useTheme = () => {
  const isLightTheme = false;

  const [
    headerVariant,
    headerLogoVariant,
    preRoomBackButtonVariant,
    timerVariant,
    joinButtonVariant,
    shareRoomButtonVariant,
    tooltipVariant,
    checkboxVariant,
    controlButtonVariant,
    spinnerVariant,
    roundedContainerVariant,
  ]: ThemeVariants = isLightTheme
    ? [
        'lightNoShadow',
        'primary',
        'buttonIconTertiary',
        'dark',
        'primary',
        'tertiary',
        'light',
        'regular',
        'buttonIconSecondaryTertiary',
        'gray80',
        'gray-0',
      ]
    : [
        'dark',
        'dark',
        'buttonIconContrastTertiary',
        'light',
        'primary',
        'contrastSecondary',
        'dark',
        'contrast',
        'buttonIconContrastTertiary',
        'white',
        'white10',
      ];

  return {
    isLightTheme,
    headerVariant,
    headerLogoVariant,
    preRoomBackButtonVariant,
    timerVariant,
    joinButtonVariant,
    shareRoomButtonVariant,
    tooltipVariant,
    checkboxVariant,
    controlButtonVariant,
    spinnerVariant,
    roundedContainerVariant,
  };
};

export default useTheme;
