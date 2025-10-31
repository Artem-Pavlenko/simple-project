import styled from "styled-components";

interface ValidationContainerProps {
  $isVisible?: boolean;
}

export const ValidationOverlay = styled.div<ValidationContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.05);
  z-index: 999;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  pointer-events: ${({ $isVisible }) => ($isVisible ? "auto" : "none")};
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(1px);
`;

export const ValidationContainer = styled.div<ValidationContainerProps>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  max-height: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid #e1e5e9;
  z-index: 1000;
  overflow: hidden;

  /* Animation properties */
  transform: ${({ $isVisible }) =>
    $isVisible
      ? "translateX(0) scale(1)"
      : "translateX(calc(100% + 40px)) scale(0.9)"};
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Add subtle bounce effect when appearing */
  ${({ $isVisible }) =>
    $isVisible &&
    `
    animation: slideInWithBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `}

  @keyframes slideInWithBounce {
    0% {
      transform: translateX(calc(100% + 40px)) scale(0.9);
      opacity: 0;
    }
    80% {
      transform: translateX(-10px) scale(1.02);
      opacity: 1;
    }
    100% {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
  }
`;

export const Header = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e1e5e9;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
`;

interface StatusIconProps {
  $isValid: boolean;
}

export const StatusIcon = styled.span<StatusIconProps>`
  font-size: 16px;
  color: ${(props) => (props.$isValid ? "#22c55e" : "#ef4444")};
`;

interface SummaryProps {
  $isValid: boolean;
}

export const Summary = styled.div<SummaryProps>`
  font-size: 12px;
  color: ${(props) => (props.$isValid ? "#22c55e" : "#ef4444")};
  font-weight: 500;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e9ecef;
  }
`;

export const Content = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 0;
`;

export const Section = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f1f3f4;

  &:last-child {
    border-bottom: none;
  }
`;

interface SectionTitleProps {
  $type: "error" | "warning";
}

export const SectionTitle = styled.h4<SectionTitleProps>`
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${(props) => {
    switch (props.$type) {
      case "error":
        return "#dc3545";
      case "warning":
        return "#fd7e14";
      default:
        return "#333";
    }
  }};
`;

interface ErrorItemProps {
  $type: "error" | "warning";
  $clickable: boolean;
}

export const ErrorItem = styled.div<ErrorItemProps>`
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")};
  border-radius: 4px;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  ${(props) =>
    props.$clickable &&
    `
    &:hover {
      background-color: #f8f9fa;
    }
  `}
`;

interface ErrorIconProps {
  $type: "error" | "warning";
}

export const ErrorIcon = styled.span<ErrorIconProps>`
  font-size: 14px;
  color: ${(props) => {
    switch (props.$type) {
      case "error":
        return "#dc3545";
      case "warning":
        return "#fd7e14";
      default:
        return "#333";
    }
  }};
  margin-top: 1px;
  flex-shrink: 0;
`;

export const ErrorContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ErrorMessage = styled.div`
  font-size: 13px;
  color: #333;
  line-height: 1.4;
  margin-bottom: 4px;
`;

export const ErrorMeta = styled.div`
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
`;

export const ErrorSuggestion = styled.div`
  font-size: 11px;
  color: #0066cc;
  font-style: italic;
`;

export const SuccessMessage = styled.div`
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: center;
`;

export const SuccessIcon = styled.span`
  font-size: 24px;
`;

export const SuccessTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #22c55e;
  margin-bottom: 4px;
`;

export const SuccessSubtitle = styled.div`
  font-size: 12px;
  color: #666;
`;
