import DotsButton from '@shared/components/DotsButton/DotsButton';
import DropdownButton from '@shared/components/DropdownButton/DropdownButton';
import { DropdownSelectionProps } from '@shared/components/DropdownButton/DropdownSelection';
import cx from 'classnames';

import testingConstants from 'utils/testingConstants';

interface OptionsDropdownProps {
  options: DropdownSelectionProps[];
  disabled?: boolean;
  openInPortal?: boolean;
  shouldPreventPropogation?: boolean;
  buttonClassName?: string;
}

const OptionsDropdown = ({
  options,
  disabled = false,
  openInPortal = false,
  shouldPreventPropogation,
  buttonClassName,
}: OptionsDropdownProps) => (
  <DropdownButton
    options={options}
    disabled={disabled}
    optionClassName="text-gray-100"
    dataTestId={testingConstants.optionsDropdown}
    openInPortal={openInPortal}
    shouldPreventPropogation={shouldPreventPropogation}
  >
    {({ open }) => <DotsButton className={cx(buttonClassName, { 'bg-gray-30': open })} />}
  </DropdownButton>
);

export default OptionsDropdown;
