import cx from 'classnames';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { To, useNavigate } from 'react-router-dom';

import { ReactComponent as ArrowBack } from '../../assets/icons/ArrowBack.svg';
import { IconType } from '../../utils/types';
import Button, { ButtonSize, ButtonVariant } from '../Button/Button';

interface GoBackButtonProps {
  path?: To | -1;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  state?: unknown;
  icon?: IconType;
  iconClassName?: string;
}

const GoBackButton = ({
  path = -1,
  variant = 'buttonIconTertiary',
  size = 'xs',
  className,
  state,
  icon,
  iconClassName,
  children,
}: PropsWithChildren<GoBackButtonProps>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goBack = () => {
    if (path !== -1) return navigate(path as To, { state });

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/', { replace: true, state });
    }
  };

  const Icon = icon ? icon : ArrowBack;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={goBack}
      className={cx('hidden rounded-xl md:flex', className)}
      aria-label={t('go_back')}
    >
      <Icon className={cx('stroke-1.5 h-6 w-6 stroke-current', iconClassName)} />
      {children && children}
    </Button>
  );
};

export default GoBackButton;
