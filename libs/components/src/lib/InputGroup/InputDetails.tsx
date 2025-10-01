import { PropsWithChildren } from 'react';

import useInputContext from './useInputContext';
import Description from '../Description/Description';
import Label from '../Label/Label';

const InputDetails = ({ children }: PropsWithChildren) => {
  const { variant, size, disabled, label, description, errorMessage } = useInputContext();

  const isContrast = variant === 'contrast';

  return (
    <>
      {!!label && (
        <Label size={size} isContrast={isContrast} disabled={disabled}>
          {label}
        </Label>
      )}
      {children}
      {!!description && (
        <Description size={size} isContrast={isContrast} isAlert={!!errorMessage} disabled={disabled}>
          {description}
        </Description>
      )}
    </>
  );
};

export default InputDetails;
