import styled from "styled-components";
import type { TagType } from "../../../utils/types";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  color: #333;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const TableHeader = styled.thead`
  background: #f8f9fa;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8f9fa;
  }
`;

export const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
  border-bottom: 2px solid #dee2e6;
`;

export const TableCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #495057;
  vertical-align: middle;
`;

export const ChallengeTitle = styled.div`
  font-weight: 500;
  color: #212529;
`;

export const StatusBadge = styled.span<{
  $status?: TagType;
}>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;

  ${({ $status }) => {
    switch ($status) {
      case "Final":
        return `
          background: #d4edda;
          color: #155724;
        `;
      case "Draft":
        return `
          background: #fff3cd;
          color: #856404;
        `;
      case "Not started":
        return `
          background: #f8d7da;
          color: #721c24;
        `;
      default:
        return `
          background: #e2e3e5;
          color: #383d41;
        `;
    }
  }}
`;

export const ActionButton = styled.button<{
  $variant: "edit" | "export" | "delete";
}>`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 8px;
  transition: background-color 0.2s;

  &:last-child {
    margin-right: 0;
  }

  ${({ $variant }) => {
    switch ($variant) {
      case "edit":
        return `
          background: #007bff;
          color: white;
          
          &:hover {
            background: #0056b3;
          }
        `;
      case "export":
        return `
          background: #28a745;
          color: white;
          
          &:hover {
            background: #1e7e34;
          }
        `;
      case "delete":
        return `
          background: #dc3545;
          color: white;
          
          &:hover {
            background: #c82333;
          }
        `;
      default:
        return `
          background: #6c757d;
          color: white;
        `;
    }
  }}
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
  font-size: 16px;
`;

export const ConfirmModal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ConfirmContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

export const ConfirmTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #212529;
  font-size: 18px;
`;

export const ConfirmMessage = styled.p`
  margin: 0 0 24px 0;
  color: #6c757d;
  line-height: 1.5;
`;

export const ConfirmButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export const ConfirmButton = styled.button<{
  $variant: "primary" | "secondary";
}>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ $variant }) => {
    if ($variant === "primary") {
      return `
        background: #dc3545;
        color: white;
        
        &:hover:not(:disabled) {
          background: #c82333;
        }
      `;
    } else {
      return `
        background: #6c757d;
        color: white;
        
        &:hover:not(:disabled) {
          background: #545b62;
        }
      `;
    }
  }}
`;
