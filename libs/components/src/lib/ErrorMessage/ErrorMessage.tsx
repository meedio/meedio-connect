import cx from 'classnames';
import { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

export interface ValidationError {
  key: string;
  values?: { [key: string]: string };
}

interface ErrorMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  message?: ValidationError | string;
  className?: string;
}

const ErrorMessage = ({ message, className, ...rest }: ErrorMessageProps) => {
  const { t } = useTranslation();

  if (!message) return null;

  const errorMessage = typeof message === 'string' ? message : t(message.key, message.values);

  return (
    <p {...rest} className={cx('text-size-sm text-alert-50 mt-2 text-ellipsis whitespace-normal', className)}>
      {errorMessage}
    </p>
  );
};

export default ErrorMessage;
