import React, { useRef } from "react";
import styled, { css } from "styled-components";

// Button preset types
type ButtonVariant = "primary" | "secondary" | "danger" | "big" | "file-import";

// Base button styles
const BaseButton = styled.button<{
  $variant: ButtonVariant;
  $disabled?: boolean;
}>`
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ $variant }) => {
    switch ($variant) {
      case "big":
        return css`
          width: 189px;
          height: 80px;
          background-color: #4c4da8ff;
          font-size: 18px;
          color: #ffffff;
          margin-bottom: 12px;

          &:hover:not(:disabled) {
            background-color: #3a3b8a;
          }
        `;

      case "primary":
        return css`
          padding: 8px 16px;
          background-color: #0d6efd;
          color: white;
          font-size: 14px;

          &:hover:not(:disabled) {
            background-color: #0b5ed7;
          }
        `;

      case "secondary":
        return css`
          padding: 8px 16px;
          background-color: #6c757d;
          color: white;
          font-size: 14px;

          &:hover:not(:disabled) {
            background-color: #5c636a;
          }
        `;

      case "danger":
        return css`
          padding: 8px 12px;
          background-color: #ef4444;
          color: white;
          font-size: 14px;

          &:hover:not(:disabled) {
            background-color: #dc2626;
          }
        `;

      case "file-import":
        return css`
          width: 189px;
          height: 80px;
          background-color: #4c4da8ff;
          font-size: 18px;
          color: #ffffff;
          margin-bottom: 12px;

          &:hover:not(:disabled) {
            background-color: #3a3b8a;
          }
        `;

      default:
        return css`
          padding: 8px 16px;
          background-color: #6c757d;
          color: white;
          font-size: 14px;
        `;
    }
  }}
`;

const HiddenFileInput = styled.input`
  display: none;
`;

interface ButtonProps {
  variant?: ButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
  onFileSelect?: (file: File) => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  disabled = false,
  onClick,
  onFileSelect,
  children,
  type = "button",
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (disabled) return;

    if (variant === "file-import" && onFileSelect) {
      fileInputRef.current?.click();
    } else if (onClick) {
      onClick();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileSelect) {
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        onFileSelect(file);
      } else {
        alert("Please select a valid JSON file.");
      }
    }
    // Reset input so same file can be selected again
    event.target.value = "";
  };

  return (
    <>
      <BaseButton
        $variant={variant}
        $disabled={disabled}
        disabled={disabled}
        onClick={handleClick}
        type={type}
        className={className}
      >
        {children}
      </BaseButton>

      {variant === "file-import" && (
        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
        />
      )}
    </>
  );
};
