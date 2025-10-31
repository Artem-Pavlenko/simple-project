import type { FC } from "react";
import * as S from "./styles";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch: FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <S.Container>
      {label && <S.Label $disabled={disabled}>{label}</S.Label>}
      <S.SwitchTrack
        $checked={checked}
        $disabled={disabled}
        onClick={handleToggle}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <S.SwitchThumb $checked={checked} />
      </S.SwitchTrack>
    </S.Container>
  );
};
