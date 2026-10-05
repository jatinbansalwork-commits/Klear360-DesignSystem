import React from 'react';

/** Borderless in-cell control — matches the **Editable** story (not full `TextInput`). */
const citedFieldRowInlineInputStyle: React.CSSProperties = {
  border: 'none',
  outline: 'none',
  width: '100%',
  font: 'inherit',
  background: 'transparent',
};

type CitedFieldRowInlineInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const CitedFieldRowInlineInput = ({
  label,
  value,
  onChange,
}: CitedFieldRowInlineInputProps): React.ReactElement => (
  <input
    aria-label={label}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    style={citedFieldRowInlineInputStyle}
  />
);

export { CitedFieldRowInlineInput, citedFieldRowInlineInputStyle };
