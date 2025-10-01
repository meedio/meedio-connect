export const inputSizes = {
  lg: 'text-size-lg px-4 h-14',
  md: 'px-4 text-size-md py-3',
  sm: 'text-size-sm px-3 h-10',
};

const defaultIconColor = 'stroke-gray-70 peer-focus:stroke-black peer-disabled:stroke-gray-50';
const defaultInputStyle = 'text-black placeholder-gray-70 disabled:text-gray-50 disabled:bg-gray-20';

export const inputVariants = {
  contrast: {
    inputStyle: 'text-white placeholder-white70 bg-transparent disabled:text-white50',
    iconColor: 'stroke-white70 peer-focus:stroke-white peer-disabled:stroke-white50',
    borderStyle: {
      main: 'hover:border-white focus-within:border-white focus-within:ring-white10',
      defaultColor: 'border-white40',
      activeColor: 'border-white',
      disabledColor: '!border-white30 !bg-white20',
    },
  },
  regular: {
    inputStyle: `bg-white ${defaultInputStyle}`,
    iconColor: defaultIconColor,
    borderStyle: {
      main: 'hover:border-primary-50 focus-within:border-gray-40 focus-within:ring-gray-30',
      defaultColor: 'border-gray-40',
      activeColor: 'border-primary-50',
      disabledColor: '!border-gray-40',
    },
  },
  'white-bg': {
    inputStyle: `bg-gray-10 valid:bg-white focus:bg-white ${defaultInputStyle}`,
    iconColor: defaultIconColor,
    borderStyle: {
      main: 'hover:border-primary-50 focus-within:border-gray-40 focus-within:ring-gray-30',
      defaultColor: 'border-gray-10',
      activeColor: 'border-primary-50',
      disabledColor: '!border-gray-40',
    },
  },
};

export type InputVariantType = keyof typeof inputVariants;
export type InputSizeType = keyof typeof inputSizes;
