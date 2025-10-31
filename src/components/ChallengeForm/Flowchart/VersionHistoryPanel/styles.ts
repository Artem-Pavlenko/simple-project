import styled from "styled-components";

export const Panel = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  right: ${(props) => (props.$isOpen ? "0" : "-400px")};
  top: 0;
  width: 400px;
  height: 100vh;
  background: #ffffff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
`;

export const VersionList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
`;

export const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
`;

export const VersionItem = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
  }
`;

export const VersionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

export const VersionInfo = styled.div`
  flex: 1;
`;

export const VersionTime = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

export const VersionDate = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

export const VersionBadge = styled.span<{ $isAutosave: boolean }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: ${(props) => (props.$isAutosave ? "#dbeafe" : "#fef3c7")};
  color: ${(props) => (props.$isAutosave ? "#1e40af" : "#92400e")};
`;

export const RestoreButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
  width: 100%;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

export const VersionDetails = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const DetailLabel = styled.span`
  font-weight: 500;
`;

export const DetailValue = styled.span`
  color: #111827;
`;

export const ClearButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #dc2626;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

export const ToggleButton = styled.button<{ $isOpen: boolean }>`
  position: fixed;
  right: ${(props) => (props.$isOpen ? "400px" : "0")};
  top: 50%;
  transform: translateY(-50%);
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px 0 0 8px;
  padding: 12px 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  z-index: 999;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transition: right 0.3s ease;
  box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #2563eb;
  }
`;
