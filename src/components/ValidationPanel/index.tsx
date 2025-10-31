import React, { useState, useEffect, useCallback } from "react";
import * as S from "./styles";
import type {
  ValidationResult,
  ValidationError,
} from "../../utils/validation/flowchartValidation";

interface IValidationPanelProps {
  validationResult: ValidationResult | null;
  onErrorClick?: (nodeId: string) => void;
  onClose: () => void;
}

export const ValidationPanel: React.FC<IValidationPanelProps> = ({
  validationResult,
  onErrorClick,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle closing animation
  const handleClose = useCallback(() => {
    setIsVisible(false);
    // Wait for animation to complete before unmounting
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 300); // Match animation duration
  }, [onClose]);

  // Handle opening animation
  useEffect(() => {
    if (validationResult) {
      setShouldRender(true);
      // Small delay to ensure the component is rendered before triggering animation
      setTimeout(() => setIsVisible(true), 10);
    }
  }, [validationResult]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isVisible) {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, handleClose]);

  if (!validationResult || !shouldRender) return null;

  const { isValid, errors, warnings } = validationResult;
  const totalIssues = errors.length + warnings.length;

  const handleErrorClick = (error: ValidationError) => {
    if (error.nodeId && onErrorClick) {
      onErrorClick(error.nodeId);
    }
  };

  return (
    <>
      <S.ValidationOverlay $isVisible={isVisible} onClick={handleClose} />
      <S.ValidationContainer $isVisible={isVisible}>
        <S.Header>
          <S.Title>
            <S.StatusIcon $isValid={isValid}>
              {isValid ? "✓" : "⚠"}
            </S.StatusIcon>
            Validation Results
          </S.Title>
          <S.Summary $isValid={isValid}>
            {isValid
              ? "All checks passed"
              : `${totalIssues} issue${totalIssues !== 1 ? "s" : ""} found`}
          </S.Summary>
          <S.CloseButton onClick={handleClose}>×</S.CloseButton>
        </S.Header>

        <S.Content>
          {errors.length > 0 && (
            <S.Section>
              <S.SectionTitle $type="error">
                Errors ({errors.length})
              </S.SectionTitle>
              {errors.map((error, index) => (
                <S.ErrorItem
                  key={`error-${index}`}
                  $type="error"
                  $clickable={!!error.nodeId}
                  onClick={() => handleErrorClick(error)}
                >
                  <S.ErrorIcon $type="error">⚠</S.ErrorIcon>
                  <S.ErrorContent>
                    <S.ErrorMessage>{error.message}</S.ErrorMessage>
                    {error.nodeId && (
                      <S.ErrorMeta>Node: {error.nodeId}</S.ErrorMeta>
                    )}
                    {error.suggestion && (
                      <S.ErrorSuggestion>{error.suggestion}</S.ErrorSuggestion>
                    )}
                  </S.ErrorContent>
                </S.ErrorItem>
              ))}
            </S.Section>
          )}

          {warnings.length > 0 && (
            <S.Section>
              <S.SectionTitle $type="warning">
                Warnings ({warnings.length})
              </S.SectionTitle>
              {warnings.map((warning, index) => (
                <S.ErrorItem
                  key={`warning-${index}`}
                  $type="warning"
                  $clickable={!!warning.nodeId}
                  onClick={() => handleErrorClick(warning)}
                >
                  <S.ErrorIcon $type="warning">⚡</S.ErrorIcon>
                  <S.ErrorContent>
                    <S.ErrorMessage>{warning.message}</S.ErrorMessage>
                    {warning.nodeId && (
                      <S.ErrorMeta>Node: {warning.nodeId}</S.ErrorMeta>
                    )}
                    {warning.suggestion && (
                      <S.ErrorSuggestion>
                        {warning.suggestion}
                      </S.ErrorSuggestion>
                    )}
                  </S.ErrorContent>
                </S.ErrorItem>
              ))}
            </S.Section>
          )}

          {isValid && (
            <S.SuccessMessage>
              <S.SuccessIcon>🎉</S.SuccessIcon>
              <div>
                <S.SuccessTitle>Flowchart is valid!</S.SuccessTitle>
                <S.SuccessSubtitle>
                  All validation checks passed successfully.
                </S.SuccessSubtitle>
              </div>
            </S.SuccessMessage>
          )}
        </S.Content>
      </S.ValidationContainer>
    </>
  );
};
