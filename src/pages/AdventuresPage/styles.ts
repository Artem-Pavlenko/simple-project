import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const NewAdventureBlock = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;
  border-radius: 8px;
  margin-bottom: 40px;
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

export const Footer = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const Adventures = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;
`;

export const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 20px;
`;
