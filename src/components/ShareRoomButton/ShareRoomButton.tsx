import Select, { SelectSize } from '@shared/components/Select/Select';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Share } from 'assets/icons/Share.svg';
import { ReactComponent as Tick } from 'assets/icons/Tick.svg';
import useToast from 'contexts/ToastProvider/useToast';
import { useIsMobile } from 'hooks/useIsMobile';

import { getEmailOptions } from './utils';

interface ShareRoomButtonProps {
  isContrast?: boolean;
  renderDropdown?: boolean;
  size?: SelectSize;
}

const ShareRoomButton = ({
  children,
  isContrast = false,
  renderDropdown = true,
  size = 'md',
}: PropsWithChildren<ShareRoomButtonProps>) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { pushToast } = useToast();

  const onCopyCompleted = () => pushToast({ variant: 'success', icon: Tick, title: t('link_copied') });
  const options = getEmailOptions(isMobile, onCopyCompleted);

  return (
    <Select options={options} icon={Share} isContrast={isContrast} renderDropdown={renderDropdown} size={size}>
      {children}
    </Select>
  );
};

export default ShareRoomButton;
