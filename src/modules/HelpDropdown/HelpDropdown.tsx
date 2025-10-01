import Button from '@shared/components/Button/Button';
import DropdownButton from '@shared/components/DropdownButton/DropdownButton';
import { DropdownSelectionProps } from '@shared/components/DropdownButton/DropdownSelection';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Help } from 'assets/icons/Help.svg';

interface HelpDropdownProps {
  isContrastVariant?: boolean;
}

const HelpDropdown = ({ isContrastVariant }: HelpDropdownProps) => {
  const { t } = useTranslation();

  const buttonVariant = isContrastVariant ? 'buttonIconContrastTertiary' : 'buttonIconSecondaryTertiary';

  const options: DropdownSelectionProps[] = [
    { title: t('help'), link: t('help_link') },
    {
      title: t('privacy_policy'),
      link: t('privacy_policy_link'),
    },
    {
      title: t('terms_of_service'),
      link: t('terms_of_service_link'),
    },
  ];

  return (
    <DropdownButton
      className="min-w-56 z-dropdown bg-white"
      options={options}
      aria-label={t('help_menu')}
      shouldPreventPropogation={false}
    >
      <Button
        size="neutral"
        variant={buttonVariant}
        className="p-2 md:p-[11px]"
        tabIndex={-1}
        aria-label={t('help_menu')}
      >
        <Help className="stroke-1.5 h-6 w-6 stroke-current" />
      </Button>
    </DropdownButton>
  );
};

export default HelpDropdown;
