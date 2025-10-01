import { DropdownSelectionProps } from '@shared/components/DropdownButton/DropdownSelection';
import SelectGroup from '@shared/components/Select/SelectGroup';
import { useTranslation } from 'react-i18next';

interface OptionsDropdownProps {
  title: string;
  options: DropdownSelectionProps[];
  disabledTitle: string;
}

const OptionsDropdown = ({ title, options, disabledTitle }: OptionsDropdownProps) => {
  const { t } = useTranslation();
  const selectedOption = options.find(({ isSelected }) => isSelected);
  const hasOptions = !!options.length;

  const optionTitle = selectedOption ? selectedOption.title : t('please_select');

  return (
    <SelectGroup disabled={!hasOptions} className="min-w-0 w-full" size="sm">
      <SelectGroup.Label>{title}</SelectGroup.Label>
      <SelectGroup.Select options={options} dropdownContainerClass="!min-w-0">
        {hasOptions ? optionTitle : disabledTitle}
      </SelectGroup.Select>
    </SelectGroup>
  );
};

export default OptionsDropdown;
