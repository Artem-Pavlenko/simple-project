import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 50px auto;
  width: 300px;
`;

export const Button = styled.button`
  padding: 8px 12px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #b91c1c;
  }
`;

export const Email = styled.div`
  font-size: 14px;
  font-weight: 500;
`;
