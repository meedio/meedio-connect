import ControlButton from '@shared/components/ControlButton/ControlButton';
import { useTranslation } from 'react-i18next';

import { ReactComponent as HangUp } from 'assets/icons/HangUp.svg';
import useHangup from 'hooks/useHangup';

const ActiveRoomHeaderHangUpButton = () => {
  const { t } = useTranslation();
  const endCall = useHangup();

  return (
    <ControlButton
      variant="destructivePrimary"
      onClick={endCall}
      className="flex h-10 w-10 items-center justify-center !rounded-2xl md:hidden"
      aria-label={t('leave')}
    >
      <HangUp className="h-6 w-6 stroke-white stroke-1.5" />
    </ControlButton>
  );
};

export default ActiveRoomHeaderHangUpButton;
