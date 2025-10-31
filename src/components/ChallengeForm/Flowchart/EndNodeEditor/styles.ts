import styled from "styled-components";

export const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: min(500px, 100vw);
  height: 100vh;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border-left: 1px solid #dee2e6;
  padding: 24px;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.h3`
  margin: 0;
  color: #333;
  font-size: 18px;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }
`;

export const FieldGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  color: #333;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

export const HelpText = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
`;
