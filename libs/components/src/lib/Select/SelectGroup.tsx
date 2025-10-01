import cx from 'classnames';
import { createContext, PropsWithChildren } from 'react';

import SelectComponent, { SelectProps } from './Select';
import useSelectGroupContext from './useSelectGroupContext';
import { DefaultFormProps } from '../../types/sharedTypes';
import DescriptionComponent from '../Description/Description';
import LabelComponent from '../Label/Label';

export const SelectGroupContext = createContext<DefaultFormProps | null>(null);

const Label = ({ children }: PropsWithChildren) => {
  const { size, isContrast, disabled } = useSelectGroupContext();

  return (
    <LabelComponent size={size} isContrast={isContrast} disabled={disabled}>
      {children}
    </LabelComponent>
  );
};

const Description = ({ children }: PropsWithChildren) => {
  const propsFromContext = useSelectGroupContext();

  return <DescriptionComponent {...propsFromContext}>{children}</DescriptionComponent>;
};

const Select = ({ children, ...rest }: PropsWithChildren<SelectProps>) => {
  const propsFromContext = useSelectGroupContext();

  return (
    <SelectComponent {...propsFromContext} {...rest}>
      {children}
    </SelectComponent>
  );
};

export type SelectGroupProps = DefaultFormProps & { className?: string };

const SelectGroup = ({
  children,
  className,
  size,
  isContrast,
  isAlert,
  disabled,
}: PropsWithChildren<SelectGroupProps>) => (
  <SelectGroupContext.Provider value={{ size, isContrast, isAlert, disabled }}>
    <div className={cx('flex flex-col space-y-2', className)}>{children}</div>
  </SelectGroupContext.Provider>
);

SelectGroup.Label = Label;
SelectGroup.Description = Description;
SelectGroup.Select = Select;

export default SelectGroup;
