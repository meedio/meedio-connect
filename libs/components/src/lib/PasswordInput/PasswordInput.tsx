import cx from 'classnames';

import useToggle from './useToggle';
import { ReactComponent as Eye } from '../../assets/icons/Eye.svg';
import { ReactComponent as EyeOff } from '../../assets/icons/EyeOff.svg';
import { InputProps } from '../InputGroup/Input';
import InputGroup, { InputGroupProps } from '../InputGroup/InputGroup';

type PasswordInputProps = { containerClassName?: string } & InputProps & InputGroupProps;
const PasswordInput = ({
  className,
  label,
  errorMessage,
  disabled,
  containerClassName,
  ...props
}: PasswordInputProps) => {
  const [isVisible, toggleIsVisible] = useToggle(false);
  const [Icon, inputType] = isVisible ? [EyeOff, 'text'] : [Eye, 'password'];

  return (
    <InputGroup label={label} errorMessage={errorMessage} disabled={disabled} className={containerClassName}>
      <InputGroup.Input
        icon={Icon}
        onIconClick={toggleIsVisible}
        type={inputType}
        autoCapitalize="none"
        className={cx('appearance-none border-none pr-14', className)}
        {...props}
      />
    </InputGroup>
  );
};

export default PasswordInput;
