import Button from '@shared/components/Button/Button';
import DropdownButton from '@shared/components/DropdownButton/DropdownButton';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Dots } from 'assets/icons/Dots.svg';
import useTheme from 'hooks/useTheme';

import useActiveRoomHeaderOptions from './useActiveRoomHeaderOptions';

const ActiveRoomHeaderOptionsButton = () => {
  const { t } = useTranslation();
  const options = useActiveRoomHeaderOptions();
  const { controlButtonVariant } = useTheme();

  return (
    <DropdownButton className="min-w-56 z-dropdown bg-white" options={options} shouldPreventPropogation={false}>
      <Button
        size="neutral"
        variant={controlButtonVariant}
        className="p-2 md:p-[11px]"
        tabIndex={-1}
        aria-label={t('toolbar_menu.toolbar_menu')}
      >
        <Dots className="stroke-1.5 h-6 w-6 stroke-current" />
      </Button>
    </DropdownButton>
  );
};

export default ActiveRoomHeaderOptionsButton;
