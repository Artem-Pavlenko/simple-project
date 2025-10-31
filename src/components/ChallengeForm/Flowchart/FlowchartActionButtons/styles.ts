import styled from "styled-components";

export const ActionButtonsContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1000;
  display: flex;
  gap: 12px;
`;

export const SaveButton = styled.button<{ $isSaving: boolean }>`
  padding: 8px 16px;
  background-color: ${({ $isSaving }) => ($isSaving ? "#9ca3af" : "#3b82f6")};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${({ $isSaving }) => ($isSaving ? "not-allowed" : "pointer")};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #2563eb;
    transform: translateY(-1px);
  }
`;

export const ValidateButton = styled.button<{ $hasErrors?: boolean }>`
  padding: 8px 16px;
  background-color: ${({ $hasErrors }) => ($hasErrors ? "#ef4444" : "#22c55e")};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background-color: ${({ $hasErrors }) =>
      $hasErrors ? "#dc2626" : "#16a34a"};
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

export const RollbackButton = styled.button`
  padding: 8px 16px;
  background-color: #f59e0b;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background-color: #d97706;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    opacity: 0.6;
  }
`;
