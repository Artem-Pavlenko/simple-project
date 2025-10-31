import styled from "styled-components";

export const Popover = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 6px;
  padding: 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 220px;
`;

export const PopoverActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
`;

export const Button = styled.button<{ $color?: string }>`
  padding: 6px 12px;
  font-size: 13px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: ${({ $color }) => $color || "#eee"};
  color: ${({ $color }) => ($color ? "#fff" : "#333")};

  &:hover {
    opacity: 0.9;
  }
`;

export const DeleteWrapper = styled.div<{ $isOpen: boolean }>`
  position: relative;
  z-index: ${({ $isOpen }) => ($isOpen ? 1001 : 5)};
  display: inline-block;
`;
