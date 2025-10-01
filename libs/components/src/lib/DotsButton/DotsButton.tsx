import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Dots } from '../../assets/icons/Dots.svg';
import Button from '../Button/Button';

export interface DotsButtonProps {
  onClick?: () => void;
  className?: string;
}

const DotsButton = ({ className, ...rest }: DotsButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      variant="buttonIconGhost"
      size="neutral"
      className={cx('!rounded-xl p-2.5', className)}
      tabIndex={-1}
      title={t('options')}
      {...rest}
    >
      <Dots className="h-5 w-5 shrink-0 stroke-black" />
    </Button>
  );
};

export default DotsButton;
