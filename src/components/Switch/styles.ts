import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Label = styled.label<{ $disabled?: boolean }>`
  font-weight: 600;
  color: ${(props) => (props.$disabled ? "#9ca3af" : "#333")};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  user-select: none;
`;

export const SwitchTrack = styled.div<{
  $checked: boolean;
  $disabled?: boolean;
}>`
  position: relative;
  width: 51px;
  height: 31px;
  background-color: ${(props) => {
    if (props.$disabled) {
      return props.$checked ? "#a0d1a0" : "#e5e7eb";
    }
    return props.$checked ? "#34c759" : "#e5e7eb";
  }};
  border-radius: 31px;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s ease;
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};

  &:hover {
    ${(props) =>
      !props.$disabled &&
      `
      background-color: ${props.$checked ? "#2fb04d" : "#d1d5db"};
    `}
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 199, 89, 0.2);
  }

  &:active {
    ${(props) =>
      !props.$disabled &&
      `
      transform: scale(0.98);
    `}
  }
`;

export const SwitchThumb = styled.div<{ $checked: boolean }>`
  position: absolute;
  top: 2px;
  left: ${(props) => (props.$checked ? "22px" : "2px")};
  width: 27px;
  height: 27px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.1);
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;
