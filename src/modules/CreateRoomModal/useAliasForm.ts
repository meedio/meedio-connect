import { ChangeEvent, useState } from 'react';
import {
  FieldValues,
  Path,
  PathValue,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form';
import slugifyText from 'slugify';

slugifyText.extend({ '%': '%', '<': '<', '>': '>', '&': '&', $: '$', '|': '|' });
const slugify = (text: string) => slugifyText(text, { lower: true, remove: /[%<>&$]/g, strict: true });

type AliasFormHook<TFieldValues extends FieldValues> = {
  getValues: UseFormGetValues<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  clearErrors: UseFormClearErrors<TFieldValues>;
  trigger: UseFormTrigger<TFieldValues>;
  watch: UseFormWatch<TFieldValues>;
  aliasInputName: Path<TFieldValues>;
  titleInputName: Path<TFieldValues>;
};

const useAliasForm = <TFieldValues extends FieldValues>({
  getValues,
  setValue,
  clearErrors,
  trigger,
  watch,
  aliasInputName,
  titleInputName,
}: AliasFormHook<TFieldValues>) => {
  const [hasAliasChanged, setHasAliasChanged] = useState(false);

  const alias = watch(aliasInputName);
  const name = watch(titleInputName);
  const isMatching = alias === slugify(name);

  const updateAlias = (alias: PathValue<TFieldValues, Path<TFieldValues>>) => {
    setValue(aliasInputName, alias, { shouldDirty: true });
    trigger(aliasInputName);
  };

  const onTitleChange =
    (onChange: (event: string) => void) =>
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      const alias = slugify(value) as PathValue<TFieldValues, Path<TFieldValues>>;
      if (!hasAliasChanged) updateAlias(alias);
      onChange(value);
      trigger(aliasInputName);
    };

  const onAliasChange =
    (onChange: (event: string) => void) =>
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setHasAliasChanged(true);
      return onChange(value.toLowerCase());
    };

  const matchTitleAndAlias = () => {
    setHasAliasChanged(false);
    setValue(aliasInputName, slugify(getValues(titleInputName)) as PathValue<TFieldValues, Path<TFieldValues>>, {
      shouldDirty: true,
    });
    clearErrors(aliasInputName);
    trigger(aliasInputName);
  };

  return {
    onTitleChange,
    onAliasChange,
    matchTitleAndAlias,
    setHasAliasChanged,
    isMatching,
    alias: typeof alias !== 'boolean' ? alias : '',
    name,
  };
};

export default useAliasForm;
