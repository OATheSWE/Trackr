import React, { FunctionComponent, useState } from 'react';
import { TextInput, PasswordInput } from '@mantine/core';
// @ts-ignore
import classes from './text-field.module.css';

interface FloatingLabelInputProps {
  value: string;
  label: string;
  placeholder: string;
  onChange: (text: string) => void;
  style?: string;
  showPasswordInput?: boolean; // New prop to control visibility of PasswordInput
  error?: string; // New prop for error messages
}

const TextField: FunctionComponent<FloatingLabelInputProps> = ({
  value,
  label,
  placeholder,
  onChange,
  style,
  showPasswordInput = false, // Default to false if not provided
  error, // Error message
}) => {
  const [focused, setFocused] = useState(false);
  const floating = (typeof value === 'string' && value.trim().length !== 0) || focused || undefined;
  return (
    <>
      {showPasswordInput ? (
        <PasswordInput
          label={label}
          placeholder={placeholder}
          required
          classNames={classes}
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          mb={`30px`}
          autoComplete="nope"
          data-floating={floating}
          labelProps={{ 'data-floating': floating }}
          className={style}
          size='md'
          error={error} // Display error message
          variant='unstyled'
        />
      ) : (
        <TextInput
          label={label}
          placeholder={placeholder}
          required
          classNames={classes}
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          mb={`30px`}
          autoComplete="nope"
          data-floating={floating}
          labelProps={{ 'data-floating': floating }}
          className={style}
          size='md'
          error={error} // Display error message
          variant='unstyled'
        />
      )}
    </>
  );
}

export default TextField;
