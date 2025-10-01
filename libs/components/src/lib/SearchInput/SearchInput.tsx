import cx from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'rooks';

import { meetingTestingConstants } from '../../../../constants/src/index';
import { ReactComponent as Search } from '../../assets/icons/Search.svg';
import { ReactComponent as X } from '../../assets/icons/X.svg';
import Button from '../Button/Button';
import InputGroup from '../InputGroup/InputGroup';
import { InputSizeType, InputVariantType } from '../InputGroup/utils';

interface SearchInputProps {
  reset?: () => void;
  onCancel?: () => void;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  variant?: InputVariantType;
  size?: InputSizeType;
  iconPlacement?: 'right' | 'left';
  iconClassName?: string;
  dataTestId?: string;
}

const SearchInput = ({
  reset,
  onCancel,
  onChange,
  placeholder,
  className,
  variant = 'regular',
  size = 'md',
  iconPlacement = 'right',
  iconClassName,
  dataTestId,
}: SearchInputProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const onChangeDebounced = useDebounce(onChange, 500);

  const iconClass = {
    className: cx(
      'mx-4 my-3 stroke-current stroke-gray-100 z-20 absolute',
      iconPlacement === 'right' ? 'right-0' : 'left-0',
      {
        'cursor-pointer': value,
      },
      iconClassName
    ),
  };

  const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(value);
    return onChangeDebounced(value);
  };

  const handleCancel = () => {
    handleClick();
    if (onCancel) onCancel();
  };

  const handleClick = () => {
    setValue('');
    if (!reset) return onChange('');

    reset();
  };

  const Icon = value ? (
    <X onClick={handleClick} {...iconClass} data-testid="x-icon" />
  ) : (
    <Search {...iconClass} data-testid="search-icon" />
  );

  return (
    <div className={cx('flex w-full items-center space-x-2', className)}>
      <InputGroup size={size}>
        <InputGroup.Input
          className={cx(iconPlacement === 'right' ? 'pr-12' : 'pl-12')}
          onChange={handleChange}
          placeholder={placeholder}
          icon={() => Icon}
          value={value}
          variant={variant}
          data-testid={dataTestId || meetingTestingConstants.searchInput}
        />
      </InputGroup>
      {onCancel && (
        <Button
          variant="text"
          size="xs"
          className="text-primary-50 border-none !p-0 !font-medium md:hidden"
          onClick={handleCancel}
        >
          {t('cancel')}
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
