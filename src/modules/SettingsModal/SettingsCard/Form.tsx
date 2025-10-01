import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@shared/components/Button/Button';
import ErrorMessage from '@shared/components/ErrorMessage/ErrorMessage';
import Input from '@shared/components/InputGroup/Input';
import cx from 'classnames';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ObjectSchema } from 'yup';

import { getFormError } from 'utils/utils';

type FormProps<T extends FieldValues> = {
  defaultValue?: string;
  onSubmit: SubmitHandler<T>;
  schema: ObjectSchema<T>;
  fieldName: string;
  loading: boolean;
  error?: string;
  placeholder: string;
  containerClassName?: string;
  buttonClassName?: string;
};

const Form = <T extends FieldValues>({
  defaultValue,
  onSubmit,
  schema,
  fieldName,
  loading,
  error,
  placeholder,
  containerClassName,
  buttonClassName,
}: FormProps<T>) => {
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: { [fieldName]: defaultValue || '' },
  });

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit as SubmitHandler<FieldValues>)();
    }
  };

  const formError = getFormError(errors, fieldName);

  return (
    <>
      <div className={cx('flex space-x-2', containerClassName)}>
        <Controller
          name={fieldName}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChange={onChange}
              inputSize="sm"
              containerClassName="max-w-[304px]"
              onKeyDown={handleEnter}
              placeholder={placeholder}
              hasError={!!formError}
            />
          )}
        />
        <Button
          onClick={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
          disabled={!!formError || loading}
          loading={loading}
          loadingText={t('loading')}
          variant="primary"
          size="sm"
          className={cx('h-10', buttonClassName)}
        >
          {t('update')}
        </Button>
      </div>
      <ErrorMessage message={(formError || error) as string | undefined} className="text-left" />
    </>
  );
};

export default Form;
