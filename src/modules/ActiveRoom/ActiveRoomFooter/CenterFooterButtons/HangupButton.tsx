import ButtonGroup from '@shared/components/ButtonGroup/ButtonGroup';
import { useTranslation } from 'react-i18next';

import { ReactComponent as HangUp } from 'assets/icons/HangUp.svg';
import FooterButton from 'components/FooterButton';
import useHangup from 'hooks/useHangup';
import testingConstants from 'utils/testingConstants';

interface HangupButtonProps {
  onClick?: () => void;
}

const HangupButton = ({ onClick }: HangupButtonProps) => {
  const { t } = useTranslation();
  const endCall = useHangup();

  return (
    <ButtonGroup className="hidden md:flex" supportTheme>
      <FooterButton
        variant="destructivePrimary"
        onClick={onClick || endCall}
        tooltipLabel={t('hang_up')}
        icon={HangUp}
        isActive
        aria-label={t('hang_up')}
        data-testid={testingConstants.hangUpButton}
      />
    </ButtonGroup>
  );
};

export default HangupButton;
