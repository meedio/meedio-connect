import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'rooks';

import { ReactComponent as Search } from '../../assets/icons/Search.svg';
import Input from '../../lib/InputGroup/Input';

interface FilterProps {
  handleOptionFilter: (value: string) => void;
}

const Filter = ({ handleOptionFilter }: FilterProps) => {
  const { t } = useTranslation();

  const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => handleOptionFilter(value);

  const handleInputChange = useDebounce(handleChange, 500);

  useEffect(() => () => handleOptionFilter(''), [handleOptionFilter]);

  return (
    <div className="flex w-full flex-col rounded-t-lg bg-white p-2 pb-0">
      <Input
        placeholder={t('search_country')}
        variant="regular"
        onChange={handleInputChange}
        onKeyDown={(e) => e.stopPropagation()}
        className="text-body-md py-[10px] pr-12"
        icon={Search}
        iconClassName="!h-5 !w-5 stroke-gray-100"
      />
      <div className="bg-gray-5 mt-2 h-px w-full" />
    </div>
  );
};

export default memo(Filter);
