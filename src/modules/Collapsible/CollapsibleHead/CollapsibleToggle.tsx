import Button from '@shared/components/Button/Button';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ReactComponent as ArrowDown } from 'assets/icons/ArrowDown.svg';

import useCollapsibleContext from '../useCollapsibleContext';

type CollapsibleToggleProps = {
  hasText?: boolean;
  arrowIconClassName?: string;
};

const CollapsibleToggle = ({ hasText = true, arrowIconClassName }: CollapsibleToggleProps) => {
  const { t } = useTranslation();
  const { isCollapsed, isCollapsible } = useCollapsibleContext();

  if (!isCollapsible) return null;

  return (
    <Button variant="textSecondary" className="flex items-center">
      {hasText && (
        <span className="font-medium hidden md:inline mr-2">{isCollapsed ? t('expand') : t('collapse')}</span>
      )}
      <ArrowDown
        className={cx('stroke-1.5 stroke-current transition-transform', arrowIconClassName, {
          'rotate-180': !isCollapsed,
        })}
      />
    </Button>
  );
};

export default CollapsibleToggle;
