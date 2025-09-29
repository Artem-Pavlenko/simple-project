import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: #f2f5fa;
  font-weight: 600;
  font-size: 14px;
  color: #333;
`;

export const Td = styled.td`
  padding: 12px;
  border-top: 1px solid #e0e6ed;
  font-size: 14px;
  color: #444;
  vertical-align: top;
`;

export const Badge = styled.span<{ $type?: "draft" | "final" }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
  color: ${({ $type }) => ($type === "final" ? "#fff" : "#555")};
  background: ${({ $type }) => ($type === "final" ? "#28a745" : "#e0e0e0")};
`;

export const Actions = styled.div`
  display: flex;
  gap: 6px;
`;

export const Button = styled.button<{ $color: string }>`
  padding: 6px 12px;
  font-size: 13px;
  border: none;
  border-radius: 6px;
  color: #fff;
  background: ${({ $color }) => $color};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
