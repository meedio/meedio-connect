import cx from 'classnames';
import { To, useNavigate } from 'react-router-dom';

import { ReactComponent as ArrowBack } from '../../../assets/icons/ArrowBack.svg';
import Button, { ButtonSize, ButtonVariant } from '../../Button/Button';

interface GoBackButtonProps {
  path?: To | -1;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  arrowClassName?: string;
  onGoBack?: () => void;
}

const GoBackButton = ({
  path = -1,
  variant = 'tertiary',
  size = 'xs',
  className,
  arrowClassName,
  onGoBack,
}: GoBackButtonProps) => {
  const navigate = useNavigate();
  const goBack = () => {
    if (onGoBack) return onGoBack();

    if (path !== -1) return navigate(path as To);

    if (window.history.state && window.history.length > 0) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <Button variant={variant} size={size} onClick={goBack} className={cx('rounded-xl', className)}>
      <ArrowBack className={cx('text-gray-60 h-6 w-6 stroke-current stroke-2', arrowClassName)} />
    </Button>
  );
};

export default GoBackButton;
