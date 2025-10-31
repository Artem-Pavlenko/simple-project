import styled from "styled-components";

export interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px #0002;
  padding: 32px 24px;
  min-width: 220px;
  max-width: 33vw;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #111827;
`;

export const Message = styled.div`
  font-size: 16px;
  margin-bottom: 16px;
  color: #111827;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export const Button = styled.button<{ $primary?: boolean }>`
  padding: 8px 20px;
  border-radius: 6px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  background: ${({ $primary }) => ($primary ? "#3b82f6" : "#e5e7eb")};
  color: ${({ $primary }) => ($primary ? "#fff" : "#111")};
  transition: background 0.2s;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
