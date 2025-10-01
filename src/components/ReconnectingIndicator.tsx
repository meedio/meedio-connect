import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import CenteredOverlay from './CenteredOverlay';
import Spinner from './Spinner/Spinner';

interface ReconnectingIndicatorProps {
  isTileInSidebar?: boolean;
}

const ReconnectingIndicator = ({ isTileInSidebar = false }: ReconnectingIndicatorProps) => {
  const { t } = useTranslation();

  const textClassName = isTileInSidebar ? 'hidden lg:block' : 'md:whitespace-nowrap';

  return (
    <CenteredOverlay className="h-auto min-h-[40px] w-auto gap-2 px-3 rounded-xl bg-black80">
      <Spinner className="stroke-2" size="xxs" />
      <p className={cx('text-xs text-white', textClassName)}>{t('connection_states.reconnecting')}...</p>
    </CenteredOverlay>
  );
};

export default ReconnectingIndicator;
