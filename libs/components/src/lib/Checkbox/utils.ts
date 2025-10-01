export const disabledCheckboxStyle = '!bg-gray-20 !border-gray-40 !ring-0 !border';
export const disabledTickStyle = '!stroke-gray-40';
export const disabledTextStyle = '!text-gray-70';

const normalCheckboxSize = {
  checkboxSize: 'h-6 w-6',
};

export const checkboxSizes = {
  lg: normalCheckboxSize,
  md: normalCheckboxSize,
  sm: {
    checkboxSize: 'h-5 w-5',
  },
};

const normalRadioSize = {
  radioSize: 'h-6 w-6',
  checkedSize: 'h-3 w-3',
};

export const radioSizes = {
  lg: normalRadioSize,
  md: normalRadioSize,
  sm: {
    radioSize: 'h-5 w-5',
    checkedSize: 'h-2 w-2',
  },
};

export const textSizes = {
  lg: {
    labelSize: 'text-size-lg',
    descriptionSize: 'text-size-md',
  },
  md: {
    labelSize: 'text-size-md',
    descriptionSize: 'text-size-sm',
  },
  sm: {
    labelSize: 'text-size-sm',
    descriptionSize: 'text-size-sm',
  },
};

export type CheckboxSizeType = keyof typeof checkboxSizes;
