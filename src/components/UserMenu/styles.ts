import styled from "styled-components";

export const MenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
    border-color: #dee2e6;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

export const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

export const UserName = styled.span`
  font-weight: 500;
`;

export const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  min-width: 200px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateY(0)" : "translateY(-10px)"};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transition: all 0.2s ease;
`;

export const MenuHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f1f3f4;
`;

export const MenuUserEmail = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
`;

export const MenuUserName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

export const MenuDivider = styled.div`
  height: 1px;
  background: #f1f3f4;
  margin: 4px 0;
`;

export const MenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }

  &:focus {
    outline: none;
    background: #f8f9fa;
  }

  &.danger {
    color: #dc3545;

    &:hover {
      background: #f8d7da;
    }
  }

  &:disabled {
    color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const MenuIcon = styled.span`
  margin-right: 8px;
  width: 16px;
  display: inline-block;
`;
