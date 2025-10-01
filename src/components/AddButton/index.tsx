import styled from "styled-components";

interface IBtnProps {
  marginBottom?: number;
}

export const AddButton = styled.button<IBtnProps>`
  margin-top: 20px;
  padding: 8px 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 18px;
  cursor: pointer;
  margin-bottom: ${({ marginBottom }) => marginBottom}px;
  font-weight: 600;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #1e40af;
  }
`;
