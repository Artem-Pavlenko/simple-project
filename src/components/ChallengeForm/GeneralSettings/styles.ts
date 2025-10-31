import styled from "styled-components";

export const Wrapper = styled.div`
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  width: 100%;
`;

export const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

export const Description = styled.div`
  width: 100%;
  min-height: 60px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  margin-top: 4px;
  padding: 8px;
  color: #333;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border-radius: 6px;
  border: none;
  margin-top: 4px;
  padding: 8px;
  font-family: inherit;
  resize: vertical;
  color: #fff;

  &:focus {
    outline: none;
  }
`;

export const Tag = styled.span`
  background: #e0f7e9;
  color: #1a7f37;
  border-radius: 6px;
  padding: 2px 8px;
  font-weight: 500;
`;

export const AddTagButton = styled.button`
  background: #e0e7ef;
  border: none;
  border-radius: 6px;
  padding: 2px 8px;
  font-weight: 500;
  cursor: pointer;
`;

export const Input = styled.input`
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 4px;
`;

export const TitleInput = styled.input`
  width: 100%;
  border-radius: 6px;
  border: none;
  margin-top: 4px;
  padding: 8px;
  color: #fff;
  font-family: inherit;

  &:focus {
    outline: none;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
`;

export const FileLabel = styled.span`
  margin-left: 8px;
`;

export const SequenceRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

export const SaveButton = styled.button`
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const ExportButton = styled.button`
  background: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #27ae60;
  }
`;

export const DeleteButton = styled.button`
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #c0392b;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

export const FieldGroup = styled.div`
  margin-bottom: 12px;
`;

export const TagsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

export const NarrowInput = styled(Input)`
  width: 60px;
  margin-left: 8px;
`;

export const FileInput = styled(Input)`
  margin-left: 8px;
`;

export const Select = styled.select`
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 4px;
`;

export const MetronomeRow = styled(Row)`
  align-items: center;
  margin-bottom: 12px;
`;

export const CheckboxInput = styled(Input)`
  margin-left: 8px;
`;

export const ValidationWarning = styled.div`
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 6px;
  padding: 12px;
  margin-top: 8px;
  margin-bottom: 12px;
  color: #92400e;
  font-size: 14px;
  line-height: 1.5;

  ul {
    margin: 0;
    padding-left: 20px;
  }

  li {
    margin-top: 4px;
  }
`;
