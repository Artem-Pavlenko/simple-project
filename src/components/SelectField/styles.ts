import styled from "styled-components";

export const FieldGroup = styled.div`
  margin-bottom: 12px;
`;

export const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

export const SelectContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

export const Select = styled.select`
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 4px;
  color: #333;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  option:disabled {
    color: #9ca3af;
  }
`;
