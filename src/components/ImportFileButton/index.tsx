import { useRef, type FC } from "react";
import styled from "styled-components";

const FileInput = styled.input`
  display: none;
`;

const ImportButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #218838;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
  }
`;

interface ImportFileButtonProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const ImportFileButton: FC<ImportFileButtonProps> = ({
  onFileSelect,
  disabled = false,
  children,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/json") {
      onFileSelect(file);
    } else if (file) {
      alert("Please select a valid JSON file.");
    }
    // Reset input so same file can be selected again
    event.target.value = "";
  };

  return (
    <>
      <ImportButton onClick={handleClick} disabled={disabled}>
        {children}
      </ImportButton>
      <FileInput
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
      />
    </>
  );
};
