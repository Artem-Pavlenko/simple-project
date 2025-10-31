import type { FC } from "react";
import * as S from "./styles";

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  label?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const SelectField: FC<SelectFieldProps> = ({
  value,
  onChange,
  options,
  label,
  disabled = false,
  placeholder,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <S.FieldGroup>
      {label && <S.Label>{label}</S.Label>}
      <S.SelectContainer>
        <S.Select value={value} onChange={handleChange} disabled={disabled}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option
              key={`${option.value}-${index}`}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </S.Select>
      </S.SelectContainer>
    </S.FieldGroup>
  );
};
