type FormSize = 'sm' | 'md' | 'lg' | 'mdCompact';

export interface DefaultFormProps {
  size?: FormSize;
  isContrast?: boolean;
  isAlert?: boolean;
  disabled?: boolean;
}

export type Interval = ReturnType<typeof setInterval>;
