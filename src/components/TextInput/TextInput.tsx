import cx from 'classnames';
import React, { FC, useEffect, useRef } from 'react';

interface TextInputProps {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name?: string;
  id?: string;
  placeholder?: string;
  hasError?: boolean;
  maxLength?: number;
}

const TextInput: FC<TextInputProps> = ({ value, onChange, name, id, placeholder, hasError, maxLength }) => {
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textInputRef.current) return;

    textInputRef.current.style.height = '96px';
    textInputRef.current.style.overflow = 'hidden';
    textInputRef.current.style.height = `${textInputRef.current.scrollHeight}px`;
  }, [value]);

  return (
    <div
      className={cx('relative flex w-full items-center overflow-hidden border rounded-2xl text-current', {
        'focus-within:border-alert-50 border border-alert-50': hasError,
        'border-gray-20 hover:border-primary-50 focus-within:border-primary-50': !hasError,
      })}
    >
      <textarea
        id={id}
        name={name}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full min-h-[96px] max-h-[250px] border-none outline-none resize-none focus:ring-0 rounded-lg text-md font-light text-black placeholder-gray-70 disabled:text-gray-50 disabled:bg-gray-20 bg-gray-10 focus:bg-white"
        rows={1}
        ref={textInputRef}
      />
    </div>
  );
};

export default TextInput;
