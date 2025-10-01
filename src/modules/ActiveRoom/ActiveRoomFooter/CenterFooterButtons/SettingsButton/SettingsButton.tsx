import { useTranslation } from 'react-i18next';

import { ReactComponent as SettingsIcon } from 'assets/icons/Settings.svg';
import FooterButton from 'components/FooterButton';

import useShowSettingsModal from './useShowSettingsModal';

const SettingsButton = () => {
  const { t } = useTranslation();
  const openSettingsModal = useShowSettingsModal();

  return (
    <FooterButton
      className=''
      onClick={openSettingsModal}
      tooltipLabel={t('settings')}
      icon={SettingsIcon}
      iconClassName='!stroke-1.5'
      aria-label={t('settings')}
    />
  );
};

export default SettingsButton;
