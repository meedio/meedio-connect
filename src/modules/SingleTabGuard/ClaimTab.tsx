import Button from '@shared/components/Button/Button';
import { useTranslation } from 'react-i18next';

import useSingleTabContext from './useSingleTabContext';

const ClaimTab = () => {
  const { t } = useTranslation();
  const { forceClaimTab } = useSingleTabContext();
  return (
    <>
      <h2 className="text-grayscale-black font-semibold text-center">{t('meedio_open_in_another_window')}</h2>
      <span className="text-center font-light md:text-lg text-grayscale-gray80">
        {t('click_continue_to_disconnect_from_window')}
      </span>
      <Button variant="primary" onClick={forceClaimTab}>
        {t('continue')}
      </Button>
    </>
  );
};

export default ClaimTab;
