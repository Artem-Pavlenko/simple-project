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
`;

export const BigBtn = styled.button`
  width: 189px;
  height: 80px;
  background-color: transparent;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #ffffff;
  background-color: #4c4da8ff;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  font-weight: 600;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1b2029;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.87);
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
