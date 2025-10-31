import React from "react";

import * as S from "./styles";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}) =>
  !isOpen ? null : (
    <S.Overlay>
      <S.Modal>
        {title && <S.Title>{title}</S.Title>}
        <S.Message>{message}</S.Message>
        <S.Actions>
          <S.Button onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </S.Button>
          <S.Button $primary onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Processing..." : confirmText}
          </S.Button>
        </S.Actions>
      </S.Modal>
    </S.Overlay>
  );
